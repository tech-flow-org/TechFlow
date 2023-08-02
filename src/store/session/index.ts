import { devtools, persist, PersistOptions } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

import { shallow } from 'zustand/shallow';
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

export const useSessionStore = createWithEqualityFn<SessionStore>()(
  persist(
    devtools(createStore, {
      name: 'TechFlow_SESSION',
    }),
    persistOptions,
  ),
  shallow,
);

export * from './selectors';
export type { SessionStore } from './store';
