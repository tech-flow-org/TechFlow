import { StateCreator } from 'zustand/vanilla';

import { SessionState, initialState } from './initialState';
import { AgentAction, createAgentSlice } from './slices/agent';
import { ChatAction, createChatSlice } from './slices/chat';

export type SessionStore = ChatAction & AgentAction & SessionState;

export const createStore: StateCreator<SessionStore, [['zustand/devtools', never]]> = (
  ...params
) => ({
  ...initialState,
  ...createAgentSlice(...params),
  ...createChatSlice(...params),
});
