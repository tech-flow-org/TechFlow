import { create } from 'zustand';
import { devtools, persist, PersistOptions } from 'zustand/middleware';

import { createStore, SessionStore } from './store';

type SessionPersist = Pick<SessionStore, 'agents' | 'chats' | 'displayMode'>;

const persistOptions: PersistOptions<SessionStore, SessionPersist> = {
  name: 'CHAT_SESSION',

  partialize: (s) => ({
    chats: s.chats,
    agents: s.agents,
    displayMode: s.displayMode,
  }),

  // 手动控制 Hydration ，避免 ssr 报错
  skipHydration: true,
};

export const useSessionStore = create<SessionStore>()(
  persist(
    devtools(createStore, {
      name: 'DrawingBoard_SESSION',
    }),
    persistOptions,
  ),
);

export * from './selectors';
export type { SessionStore } from './store';
