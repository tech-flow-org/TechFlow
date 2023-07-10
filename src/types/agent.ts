import { ModelType } from '@/store/mask';
import { ChatMessage } from './chat';

export type ChatExample = ChatMessage[];

/**
 * 对话机器人的扮演角色
 */
export interface ChatAgent {
  // 元数据
  /**
   * @title 角色 ID
   */
  id: string;
  /**
   * @title 角色名称
   * @description 可选参数，如果不传则使用默认名称
   */
  title?: string;
  description?: string;
  /**
   * @title 角色头像
   * @description 可选参数，如果不传则使用默认头像
   */
  avatar?: string;
  /**
   * @title 角色头像背景色
   * @description 可选参数，如果不传则使用默认背景色
   */
  avatarBackground?: string;
  updateAt?: number;
  createAt?: number;

  // 实体
  /**
   * @title 角色所使用的 LLM 模型
   * @description 可选参数，如果不传则使用默认模型
   */
  model?: ModelType;
  /**
   * @title 角色对话内容
   */
  content: string;
  /**
   * @title 角色唯一性标识
   * @description 基于 content 生成 hash 作为角色唯一性标识
   */
  hash: string;

  // 如果包含 children 说明存在子任务
  children?: ChatAgent[];
}

export type ChatAgentMap = Record<string, ChatAgent>;

export type ChatAgentWithoutFlow = Omit<ChatAgent, 'flow'>;
