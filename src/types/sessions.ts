import { ChatAgent, ChatAgentMap } from '@/types/agent';
import { ChatContext, ChatContextMap } from './chat';

export interface NewChatSession extends Omit<ChatContext, 'id' | 'updateAt' | 'createAt'> {
  agent: Omit<ChatAgent, 'id' | 'hash'>;
}

/**
 * 会话树节点
 */
export interface SessionTreeNode {
  /**
   * @title 角色 ID
   * @description 角色 ID，用于标识该节点所属的角色
   */
  agentId: string;

  /**
   * @title 聊天记录列表
   * @description 聊天记录列表，用于记录该节点对应角色与用户之间的聊天记录
   */
  chats: string[];
  // 创建时间戳
  createAt?: number;
  // 更新时间
  updateAt?: number;
}

export type SessionTree = SessionTreeNode[];
/**
 * 对话机器人会话状态
 */
export interface ChatSessionState {
  /**
   * @title 聊天上下文映射
   * @description 用于记录每个用户与每个角色的聊天上下文
   */
  chats: ChatContextMap;

  /**
   * @title 角色映射
   * @description 用于记录所有角色及其对应的信息
   */
  agents: ChatAgentMap;
}
