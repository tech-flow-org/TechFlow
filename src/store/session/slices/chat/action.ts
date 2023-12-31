import { produce } from 'immer';
import Router from 'next/router';
import { v4 as uuid } from 'uuid';
import { StateCreator } from 'zustand/vanilla';

import { ChatAgent, ChatContext, ChatSessionState, NewChatSession } from '@/types';

import { getSafeAgent } from '@/helpers/agent';
import { genShareMessagesUrl } from '@/helpers/url';
import { promptSummaryDescription, promptSummaryTitle } from '@/prompts/chat';
import { fetchPresetTaskResult } from '@/utils/fetch';

import { SessionStore } from '@/store';
import { HistoryDispatch, sessionsReducer } from './reducers/chats';
import { chatSelectors } from './selectors';

export interface ChatAction {
  /**
   * @title 添加会话
   * @param session - 会话信息
   * @returns void
   */
  addChat: (session: NewChatSession) => Promise<void>;
  /**
   * @title 删除会话
   * @param index - 会话索引
   * @returns void
   */
  removeChat: (sessionId: string) => void;

  /**
   * @title 切换会话
   * @param sessionId - 会话索引
   * @returns void
   */
  switchChat: (sessionId?: string | 'new') => void;

  /**
   * 分发聊天记录
   * @param payload - 聊天记录
   */
  dispatchChat: (payload: HistoryDispatch) => void;

  /**
   * 生成压缩后的消息
   * @returns 压缩后的消息
   */
  genShareUrl: () => string;

  /**
   * 导入聊天记录
   * @param chatSessions - 聊天记录状态
   */
  importChatSessions: (chatSessions: ChatSessionState) => void;

  addAgentToChat: (chatId: string, agent: ChatAgent) => void;

  autoAddChatBasicInfo: (chatId: string) => void;
}

export const createChatSlice: StateCreator<
  SessionStore,
  [['zustand/devtools', never]],
  [],
  ChatAction
> = (set, get) => ({
  dispatchChat: (payload) => {
    const { type, ...res } = payload;

    set({ chats: sessionsReducer(get().chats, payload) }, false, {
      type: `dispatchChat/${type}`,
      payload: res,
    });
  },

  addChat: async ({ messages, agent }) => {
    const { dispatchChat, switchChat, findOrCreateAgent } = get();

    const uniqueAgent = findOrCreateAgent(agent);

    const timestamp = Date.now();

    const newSession: ChatContext = {
      id: uuid(),
      messages,
      agentId: uniqueAgent.id,
      createAt: timestamp,
      updateAt: timestamp,
    };

    dispatchChat({ type: 'addChat', chat: newSession });

    switchChat(newSession.id);

    get().autocompleteAgentMetaInfo(uniqueAgent.id);

    get().autoAddChatBasicInfo(newSession.id);
  },

  removeChat: (sessionId) => {
    get().dispatchChat({ type: 'removeChat', id: sessionId });
    get().switchChat();
  },

  switchChat: (sessionId) => {
    if (get().activeId === sessionId) return;

    set({ activeId: sessionId });

    // 新会话
    if (!sessionId || sessionId === 'new') {
      Router.push('/');
    } else {
      // 切换老会话
      Router.push(`/chat/${sessionId}`);
      return;
    }
  },

  genShareUrl: () => {
    const context = chatSelectors.currentChat(get());
    if (!context) return '';

    const agent = getSafeAgent(get().agents, context.agentId);
    return genShareMessagesUrl(context.messages, agent.content);
  },

  importChatSessions: ({ chats, agents }) => {
    set(
      produce((draft: ChatSessionState) => {
        const sameHashAgents: Map<string, string> = new Map();

        // 处理 agents
        for (const agent of Object.values(agents)) {
          const agentHash = agent.hash;
          const existAgent = Object.values(draft.agents).find((a) => a.hash === agentHash);

          if (!existAgent) {
            draft.agents[agent.id] = agent;
          } else {
            sameHashAgents.set(agent.id, existAgent.id);
          }
        }

        // 处理 chats
        for (const [chatId, chat] of Object.entries(chats)) {
          if (!draft.chats[chatId]) {
            // 检查并替换 agentId
            if (chat.agentId && sameHashAgents.has(chat.agentId)) {
              chat.agentId = sameHashAgents.get(chat.agentId) as string;
            }

            draft.chats[chatId] = chat;
          }
        }
      }),
    );

    // 自动添加描述和标题
    Object.values(get().chats).forEach((c) => {
      get().autoAddChatBasicInfo(c.id);
    });

    Object.values(get().agents).forEach((a) => {
      get().autocompleteAgentMetaInfo(a.id);
    });
  },

  autoAddChatBasicInfo: (chatId) => {
    const chat = get().chats[chatId];
    const updateMeta = (key: 'title' | 'description') => {
      let value = '';
      return (text: string) => {
        value += text;
        get().dispatchChat({
          type: 'updateSessionChatContext',
          id: chatId,
          key,
          value,
        });
      };
    };

    if (!chat) return;
    if (!chat.title) {
      fetchPresetTaskResult({
        params: promptSummaryTitle(chat.messages),
        onLoadingChange: (loading) => {
          set({ summarizingTitle: loading });
        },
        onMessageHandle: updateMeta('title'),
      });
    }

    if (!chat.description) {
      fetchPresetTaskResult({
        params: promptSummaryDescription(chat.messages),
        onLoadingChange: (loading) => {
          set({ summarizingDescription: loading });
        },
        onMessageHandle: updateMeta('description'),
      });
    }
  },

  addAgentToChat: (chatId, agent) => {
    const uniqueAgent = get().findOrCreateAgent(agent);

    get().dispatchAgent({
      type: 'addAgent',
      id: uniqueAgent.id,
      content: agent.content,
      title: agent.title,
    });

    get().dispatchChat({
      type: 'updateSessionChatContext',
      key: 'agentId',
      id: chatId,
      value: uniqueAgent.id,
    });
  },
});
