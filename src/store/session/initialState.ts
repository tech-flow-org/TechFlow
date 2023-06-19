import { AgentState, initialAgentState } from './slices/agent';
import { SessionChatState, initialChatState } from './slices/chat';

export type SessionDisplayMode = 'agent' | 'chat' | 'group';

export interface SessionState extends SessionChatState, AgentState {
  /**
   * @title 当前活动的会话
   * @description 当前正在编辑或查看的会话
   * @default null
   */
  expandRoles: string[];
  activeId: string | null;
  displayMode: SessionDisplayMode;
  keywords: string;
}

export const initialState: SessionState = {
  activeId: null,
  displayMode: 'chat',
  keywords: '',
  expandRoles: [],

  ...initialChatState,
  ...initialAgentState,
};

export { initialAgent } from './slices/agent';
