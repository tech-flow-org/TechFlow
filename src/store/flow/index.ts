import { devtools, persist, PersistOptions } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

import { shallow } from 'zustand/shallow';
import { createStore, FlowStore } from './action';

type FlowPersist = Pick<
  FlowStore,
  'showTerminal' | 'displayMode' | 'showNodeManager' | 'terminalHeight' | 'flows'
>;

const persistOptions: PersistOptions<FlowStore, FlowPersist> = {
  name: 'CHAT_FLOW',

  partialize: (s): FlowPersist => ({
    displayMode: s.displayMode,
    flows: s.flows,
    showNodeManager: s.showNodeManager,
    showTerminal: s.showTerminal,
    terminalHeight: s.terminalHeight,
  }),
  // 手动控制 Hydration ，避免 ssr 报错
  skipHydration: true,
};

export const useFlowStore = createWithEqualityFn<FlowStore>()(
  persist(
    devtools(createStore, {
      name: 'CHAT_FLOW',
    }),
    persistOptions,
  ),
  shallow,
);

export type { FlowStore } from './action';
export * from './selectors';
