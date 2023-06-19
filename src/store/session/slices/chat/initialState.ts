import { ChatContextMap } from '@/types';

export interface SessionChatState {
  /**
   * @title 聊天上下文映射
   * @description 用于记录每个用户与每个角色的聊天上下文
   */
  chats: ChatContextMap;

  summarizingTitle: boolean;
  summarizingDescription: boolean;
}

export const initialChatState: SessionChatState = {
  chats: {},
  // loading 中间态
  summarizingTitle: false,
  summarizingDescription: false,
};
