import { ChatAgent, ChatContext } from '@/types';

export interface InternalChatContext extends Omit<ChatContext, 'id' | 'agentId'> {
  // 智能体
  agent: Omit<ChatAgent, 'id'>;
}
