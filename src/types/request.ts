import { ChatMessage } from './chat';

/**
 * 请求数据类型
 */
export interface OpenAIRequestParams {
  /**
   * @title 系统角色
   * @type string
   */
  systemRole: string;
  /**
   * @title 消息内容
   * @type string
   */
  message?: string;
  /**
   * 中间的聊天记录
   */
  messages?: ChatMessage[];
}
