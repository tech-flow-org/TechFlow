import { Workflow, WorkflowMap } from '@/types/flow';
import { produce } from 'immer';

export type FlowsDispatch =
  | { type: 'addFlow'; flow: Workflow }
  | { type: 'deleteFlow'; id: string }
  | { type: 'updateFlow'; id: string; flow: Partial<Workflow>; updateDate?: boolean }
  | {
      type: 'updateFlowState';
      id: string;
      state: Partial<Workflow['state']>;
      updateDate?: boolean;
    }
  | {
      type: 'updateFlowMeta';
      id: string;
      meta: Partial<Workflow['meta']>;
    };

export const flowsReducer = (state: WorkflowMap, payload: FlowsDispatch): WorkflowMap => {
  switch (payload.type) {
    case 'addFlow':
      return produce(state, (draftState) => {
        const { flow } = payload;
        draftState[flow.id] = payload.flow;
      });

    case 'deleteFlow':
      return produce(state, (draftState) => {
        delete draftState[payload.id];
      });

    case 'updateFlow':
      return produce(state, (draftState) => {
        const flow = draftState[payload.id];
        delete payload.flow.id;
        if (flow) {
          Object.assign(
            flow,
            payload.flow,
            payload.updateDate !== false ? { updateAt: Date.now() } : {},
          );
        }
      });

    case 'updateFlowState':
      return produce(state, (draftState) => {
        const flow = draftState[payload.id];
        if (!flow) return;

        flow.state = { ...flow.state, ...payload.state };

        if (payload.updateDate !== false) {
          flow.updateAt = Date.now();
        }
      });

    case 'updateFlowMeta':
      return produce(state, (draftState) => {
        const flow = draftState[payload.id];
        if (!flow) return;

        flow.meta = { ...flow.meta, ...payload.meta };

        flow.updateAt = Date.now();
      });

    default:
      return state;
  }
};
