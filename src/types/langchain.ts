import { ChatMessage } from './chat';

export interface LangChainParams {
  llm: {
    model: string;
    temperature: number;
    top_p?: number;
    frequency_penalty?: number;
    max_tokens?: number;
  };

  /**
   * @title 聊天信息列表
   */
  prompts: ChatMessage[];
  vars: Record<string, string>;
}
