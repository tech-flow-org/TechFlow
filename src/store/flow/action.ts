import type { StateCreator } from 'zustand';

import { FlowState, initialState } from './initialState';

import { FlowCRUDSlice, flowCrudSlice } from './slices/flow';
import { FlowRunnerSlice, runnerSlice } from './slices/runner';

type FlowAction = FlowCRUDSlice & FlowRunnerSlice;

export type FlowStore = FlowAction & FlowState;

export const createStore: StateCreator<FlowStore, [['zustand/devtools', never]]> = (
  set,
  get,
  ...params
) => ({
  ...initialState,
  ...runnerSlice(set, get, ...params),
  ...flowCrudSlice(set, get, ...params),
});
