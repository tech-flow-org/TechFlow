import {
  getFlowMeta,
  getFlowNodeById,
  getNodeContentById,
  getResultVariables,
  getSafeFlow,
  getSafeFlowNodeById,
  getSourceDataOfNode,
} from '@/helpers/flow';
import { FlowStore } from '@/store/flow';
import { AITaskContent } from '@/types/flow';
import { FlowBasicNode } from 'kitchen-flow-editor';

export const flowSelectors = {
  currentFlow: (s: FlowStore) => s.flows[s.activeId || ''],
  currentFlowMeta: (s: FlowStore) => getSafeFlow(s.flows, s.activeId).meta,
  currentFlowSafe: (s: FlowStore) => getSafeFlow(s.flows, s.activeId),

  flowList: (s: FlowStore) => Object.values(s.flows),
  flowMetaList: (s: FlowStore) => Object.values(s.flows).map(getFlowMeta),

  getCurrentEdges: (s: FlowStore) => Object.values(flowSelectors.currentFlowSafe(s).flattenEdges),
  getNodeById: (id: string) => (s: FlowStore) => {
    const flow = flowSelectors.currentFlow(s);
    return getFlowNodeById(flow, id);
  },

  getNodeByIdSafe:
    <T = AITaskContent>(id: string) =>
    (s: FlowStore): FlowBasicNode<T> => {
      const flow = flowSelectors.currentFlowSafe(s);
      return getSafeFlowNodeById(flow, id) as FlowBasicNode<T>;
    },

  getNodeContentById:
    <T = AITaskContent>(id: string) =>
    (s: FlowStore): T =>
      getNodeContentById(flowSelectors.currentFlowSafe(s), id) as T,

  getResultVariables: (s: FlowStore) => {
    return getResultVariables(flowSelectors.currentFlowSafe(s));
  },

  getSourceDataOfNode: (id: string) => (s: FlowStore) => {
    const flow = flowSelectors.currentFlowSafe(s);
    return getSourceDataOfNode(id, flow.flattenNodes, flow.flattenEdges);
  },
};
