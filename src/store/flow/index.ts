import { create } from 'zustand';
import { devtools, persist, PersistOptions } from 'zustand/middleware';

import { Migration } from '@/migrations';

import { createStore, FlowStore } from './action';

type FlowPersist = Pick<
  FlowStore,
  'showTerminal' | 'displayMode' | 'showNodeManager' | 'terminalHeight' | 'flows'
>;

const persistOptions: PersistOptions<FlowStore, FlowPersist> = {
  name: 'CHAT_FLOW',
  version: Migration.targetVersion,

  partialize: (s): FlowPersist => ({
    displayMode: s.displayMode,
    flows: s.flows,
    showNodeManager: s.showNodeManager,
    showTerminal: s.showTerminal,
    terminalHeight: s.terminalHeight,
  }),

  migrate: (persistedState: any, version) => {
    const { state } = Migration.migrate({ state: persistedState, version });

    return { ...persistedState, ...state };
  },
  // 手动控制 Hydration ，避免 ssr 报错
  skipHydration: true,
};

export const useFlowStore = create<FlowStore>()(
  persist(
    devtools(createStore, {
      name: 'CHAT_FLOW',
    }),
    persistOptions,
  ),
);

export type { FlowStore } from './action';
export * from './selectors';
