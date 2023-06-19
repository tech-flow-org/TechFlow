import { SessionStore } from '@/store';
import { ChatContext, SessionTree } from '@/types';

import { filterWithKeywords } from '@/utils/filter';

export const currentChatContextSel = (
  s: SessionStore,
): Omit<ChatContext, 'systemRole'> | undefined => {
  if (!s.activeId) return;

  return s.chats[s.activeId];
};

export const chatListSel = (s: SessionStore) => {
  const filterChats = filterWithKeywords(s.chats, s.keywords, (item) => [item.messages.join('')]);

  return Object.values(filterChats).sort((a, b) => (b.updateAt || 0) - (a.updateAt || 0));
};

export const sessionTreeSel = (s: SessionStore) => {
  const sessionTree: SessionTree = [
    {
      agentId: 'default',
      chats: chatListSel(s)
        .filter((s) => !s.agentId)
        .map((c) => c.id),
    },
  ];

  Object.values(s.agents).forEach((agent) => {
    const chats = Object.values(s.chats).filter((s) => s.agentId === agent.id);

    sessionTree.push({
      agentId: agent.id,
      chats: chats.map((c) => c.id),
    });
  });

  return sessionTree;
};
