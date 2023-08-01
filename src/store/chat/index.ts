import { produce } from 'immer';
import { create } from 'zustand';
import { optionalDevtools } from 'zustand-utils';
import { StateCreator } from 'zustand/vanilla';

import { initialAgent } from '@/store/session/initialState';
import { ChatAgent, ChatContext, ChatMessage } from '@/types';
import { Compressor } from '@/utils/compass';
import { genChatMessages } from '@/utils/genChatMessages';

interface ChatState {
  agent: ChatAgent;
  chat: ChatContext;
}

export const initChat: ChatContext = {
  id: 'new',
  messages: [],
  updateAt: -1,
  createAt: -1,
};

export const initialState: ChatState = {
  chat: initChat,
  agent: initialAgent,
};

interface ChatStore extends ChatState {
  genCompassedMessages: () => string;
  resetChat: () => void;
  updateAgentContent: (content: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
}

const createStore: StateCreator<ChatStore, [['zustand/devtools', never]]> = (set, get) => ({
  ...initialState,
  genCompassedMessages: () => {
    const { agent, chat } = get();

    const compassedMsg = genChatMessages({ messages: chat.messages, systemRole: agent.content });

    return `/share?messages=${Compressor.compress(JSON.stringify(compassedMsg))}`;
  },

  updateAgentContent: (content) => {
    set(
      produce((draft) => {
        draft.agent.content = content;
      }),
    );
  },

  setMessages: (messages) => {
    set(
      produce((draft) => {
        draft.chat.messages = messages;
      }),
      false,
      'setMessages',
    );
  },

  resetChat: () => {
    set(initialState);
  },
});

export const useChatStore = create<ChatStore>()(
  optionalDevtools(true)(
    createStore,
    // persist<ChatStore>(createStore, {
    //   name: 'CHAT_URL',
    //   partialize: ((s: ChatState) => ({
    //     systemRole: s.agent.content,
    //   })) as any,
    //   storage: createHashStorage(),
    // }),
    { name: 'TechFlow_CHAT' },
  ),
);

export const modelSel = (s: ChatStore) => s.agent.model;
