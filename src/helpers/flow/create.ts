import { merge } from 'lodash-es';
import { Node } from 'reactflow';

import { initAITaskContent } from '@/store/flow/initialState';
import { AITaskContent, FlowAITaskNode, Workflow } from '@/types/flow';
import { MetaData } from '@/types/meta';
import { IFlowBasicNode } from 'kitchen-flow-editor';

export const createFlow = (
  id: string,
  meta: MetaData,
  flattenNodes: Record<string, IFlowBasicNode>,
): Workflow => {
  return {
    id,
    meta,
    state: {},
    createAt: Date.now(),
    updateAt: Date.now(),
    flattenNodes,
    flattenEdges: {},
    outputTemplate: '',
    previewInput: '',
  };
};

export const createNode = (node: Partial<Node>, content?: any, meta?: Partial<MetaData>) =>
  ({
    ...node,
    position: { x: 0, y: 0, ...node.position },
    data: {
      id: node.id,
      state: { collapsedKeys: [] },
      content,
      meta,
    },
  } as IFlowBasicNode);

export const createAITaskContent = (content: Partial<AITaskContent>): AITaskContent => {
  return merge({}, initAITaskContent, content);
};

export const createTextTaskNode = (
  node: Partial<Node>,
  content: Partial<AITaskContent>,
  meta: Partial<MetaData>,
): FlowAITaskNode => {
  return createNode(
    {
      ...node,
      type: 'string',
    },
    createAITaskContent(content),
    meta,
  );
};
