import { ChatMessage } from './chat';

/**
 * LLM 模型枚举
 */
export enum LLMModel {
  /**
   * @title GPT 3.5 Turbo
   * @description 一个高性能的自然语言处理模型，由 OpenAI 开发
   */
  GPT3_5 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4',

  /**
   * @title Chat GLM
   * @description 一个基于 GLM 模型的聊天机器人，由清华开发
   */
  CHAT_GLM = 'chatGLM-6B',
}

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
  model?: LLMModel;
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
