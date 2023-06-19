import { produce } from 'immer';
import { Md5 } from 'ts-md5';
import { StateCreator } from 'zustand/vanilla';

import { fetchChatModel } from '@/services/chatModel';
import { initialAgent } from '@/store/session/initialState';
import { ChatAgent, ChatMessage } from '@/types';
import { FetchSSEOptions, fetchSSE } from '@/utils/fetch';

import { LOADING_FLAT } from '@/components/Chat/const';
import { ChatState, initialState } from './initialState';
import { MessageDispatch, messagesReducer } from './messageReducer';

interface ChatAction {
  /**
   * @title 发送消息
   * @returns Promise<void>
   */
  sendMessage: () => Promise<void>;
  /**
   * @title 重发消息
   * @param index - 消息索引
   * @returns Promise<void>
   */
  resendMessage: (index: number) => Promise<void>;
  /**
   * @title 更新 Agent 角色
   * @param content - 角色内容
   */
  updateAgentContent: (content: string) => void;

  /**
   * @title 移除系统角色
   * @returns void
   */
  removeAgent: () => void;

  generateMessage: (
    message: string,
    messages: ChatMessage[],
    options: FetchSSEOptions,
  ) => Promise<void>;

  /**
   * @title 派发消息
   * @param payload - 消息分发
   * @returns void
   */
  dispatchMessage: (payload: MessageDispatch) => void;
  /**
   * @title 处理消息编辑
   * @param index - 消息索引或空
   * @returns void
   */
  handleMessageEditing: (index?: number | null) => void;
}

export type ChatStore = ChatAction & ChatState;

export const createStore: StateCreator<ChatStore, [['zustand/devtools', never]]> = (set, get) => ({
  ...initialState,

  dispatchMessage: (payload) => {
    const { type, ...res } = payload;

    const messages = messagesReducer(get().messages, payload);

    set({ messages }, false, {
      type: `dispatchMessage/${type}`,
      payload: res,
    });

    get().onMessagesChange?.(messages);
  },

  updateAgentContent: (content) => {
    set(
      produce((draft) => {
        draft.agent.content = content;
        draft.agent.hash = Md5.hashStr(content);
      }),
      false,
      { type: 'updateAgent', content },
    );

    get().onAgentChange?.(get().agent as ChatAgent, 'update');
  },

  removeAgent: () => {
    set(
      produce((draft) => {
        draft.agent = initialAgent;
      }),
      false,
      { type: 'removeAgent' },
    );

    get().onAgentChange?.(initialAgent, 'remove');
  },

  handleMessageEditing: (index) => {
    set({ editingMessageId: index });
  },

  generateMessage: async (message, messages, options) => {
    await get().onResponseStart?.(get().messages);
    set({ loading: true });

    const fetcher = () =>
      fetchChatModel({ message, systemRole: get().agent.content || '', messages });

    await fetchSSE(fetcher, options);

    set({ loading: false });

    get().onResponseFinished?.({ messages: get().messages, agent: get().agent });
  },

  sendMessage: async () => {
    const { message, dispatchMessage, generateMessage, messages } = get();
    if (!message) return;

    set({ message: '' });
    dispatchMessage({ type: 'addUserMessage', message });

    // 添加一个空的信息用于放置 ai 响应
    dispatchMessage({ type: 'addMessage', message: { role: 'assistant', content: LOADING_FLAT } });

    let currentResponse: string[] = [];

    // 生成 messages
    await generateMessage(message, messages, {
      onMessageHandle: (text) => {
        currentResponse = [...currentResponse, text];

        dispatchMessage({ type: 'updateLatestBotMessage', responseStream: currentResponse });

        // 滚动到最后一条消息
        const item = document.getElementById('for-loading');
        if (!item) return;

        item.scrollIntoView({ behavior: 'smooth' });
      },
      onErrorHandle: (error) => {
        dispatchMessage({ type: 'setErrorMessage', error, index: get().messages.length - 1 });
      },
    });
  },

  resendMessage: async (index) => {
    const { dispatchMessage, sendMessage, generateMessage, messages } = get();
    const lastMessage = messages.at(-1);
    // 用户通过手动删除，造成了他的问题是最后一条消息
    // 这种情况下，相当于用户重新发送消息
    if (messages.length === index && lastMessage?.role === 'user') {
      dispatchMessage({ type: 'deleteMessage', index: index - 1 });
      set({ message: lastMessage.content });
      await sendMessage();
      return;
    }

    // 上下文消息就是当前消息之前的消息
    const contextMessages = get().messages.slice(0, index);

    // 上下文消息中最后一条消息
    const userMessage = contextMessages.at(-1)?.content;
    if (!userMessage) return;

    const targetMsg = messages[index];

    // 如果不是 assistant 的消息，那么需要额外插入一条消息
    if (targetMsg.role !== 'assistant') {
      dispatchMessage({
        type: 'insertMessage',
        index,
        message: { role: 'assistant', content: LOADING_FLAT },
      });
    } else {
      const botPrevMsg = targetMsg.content;
      // 保存之前的消息为历史消息
      dispatchMessage({ type: 'updateMessageChoice', message: botPrevMsg, index });
      dispatchMessage({ type: 'updateMessage', message: LOADING_FLAT, index });
    }

    // 重置错误信息
    dispatchMessage({ type: 'setErrorMessage', error: undefined, index });

    // 开始更新消息
    let currentResponse: string[] = [];

    await generateMessage(userMessage, contextMessages, {
      onMessageHandle: (text) => {
        currentResponse = [...currentResponse, text];
        dispatchMessage({ type: 'updateMessage', message: currentResponse.join(''), index });
      },
      onErrorHandle: (error) => {
        dispatchMessage({ type: 'setErrorMessage', error, index });
      },
    });
  },
});
