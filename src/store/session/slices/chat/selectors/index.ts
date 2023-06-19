import { chatListSel, currentChatContextSel, sessionTreeSel } from './list';

export const chatSelectors = {
  currentChat: currentChatContextSel,
  chatList: chatListSel,
  sessionTree: sessionTreeSel,
};
