import { ChatAgent, ChatAgentMap } from '@/types';

export interface AgentState {
  /**
   * @title 角色映射
   * @description 用于记录所有角色及其对应的信息
   */
  agents: ChatAgentMap;
  addingAgentName: boolean;
  pickingEmojiAvatar: boolean;
}

export const initialAgent: ChatAgent = {
  content: '',
  id: '',
  hash: '',
  model: 'gpt-3.5-turbo',
};

export const initialAgentState: AgentState = {
  agents: {},
  // loading 中间态
  addingAgentName: false,
  pickingEmojiAvatar: false,
};
