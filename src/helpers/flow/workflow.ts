import { initialFlow } from '@/store/flow/initialState';
import {
  OutputNodeContent,
  ResultVariable,
  Workflow,
  WorkflowMap,
  WorkflowMeta,
} from '@/types/flow';
import { StringTemplate } from '@/utils/StringTemplate';
import { IFlowBasicNode } from 'kitchen-flow-editor';

export const getFlowMeta = (flow: Workflow): WorkflowMeta => {
  const { id, createAt, updateAt, meta } = flow;

  return { id, createAt, updateAt, ...meta };
};

export const getSafeFlow = (flows: WorkflowMap, id?: string | null): Workflow => {
  if (!id || !flows[id]) return initialFlow;

  return flows[id];
};

export const getSafeFlowMeta = (flows: WorkflowMap, id?: string | null): WorkflowMeta => {
  if (!id || !flows[id]) return initialFlow;

  return getFlowMeta(flows[id]);
};

export const getResultVariables = (flow: Workflow) => {
  const nodes = Object.values(flow.flattenNodes).filter((i) => i.type === 'result');

  return new StringTemplate(flow.outputTemplate).variableNames.map((v) => {
    const variable: ResultVariable = { name: v };
    const node = nodes.find(
      (e: IFlowBasicNode<OutputNodeContent>) => v === e.data.content.variable,
    );

    // 有节点的情况下，查找source id
    if (node) {
      variable.nodeId = node.id;

      const edges = Object.values(flow.flattenEdges || {});
      const edge = edges.find((e) => e.target === node.id);

      if (edge) {
        variable.sourceId = edge.source;
        variable.contentKey = edge.sourceHandle ? edge.sourceHandle : undefined;
      }
    }

    return variable;
  });
};
