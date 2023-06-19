import { initAITaskNode } from '@/store/flow/initialState';
import { AITaskContent, FlowAITaskNode, Workflow } from '@/types/flow';

export const getFlowNodeById = (flow: Workflow, nodeId: string): FlowAITaskNode => {
  return flow.flattenNodes[nodeId];
};

export const getSafeFlowNodeById = (flow: Workflow, nodeId: string): FlowAITaskNode => {
  return flow.flattenNodes[nodeId] || initAITaskNode;
};

export const getNodeContentById = (flow: Workflow, nodeId: string): AITaskContent | undefined => {
  const node = getFlowNodeById(flow, nodeId);
  if (!node) return;

  return node.data.content;
};
