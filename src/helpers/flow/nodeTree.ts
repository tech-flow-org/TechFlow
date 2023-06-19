import { FlattenEdges, FlattenNodes } from 'kitchen-flow-editor';

import lodashGet from 'lodash.get';

// 判断是否有连线
export const hasFlowRunner = (flattenEdges: FlattenEdges): boolean => {
  return !(!flattenEdges || !Object.keys(flattenEdges).length);
};

export const getSourceDataOfNode = (
  nodeId: string,
  flattNodes: FlattenNodes,
  flattEdges: FlattenEdges = {},
) => {
  const edge = Object.values(flattEdges).find((e) => e.target === nodeId);
  if (!edge) return;

  // 找到上游数据源
  const sourceNode = flattNodes[edge.source];

  return !edge.sourceHandle || edge.sourceHandle === 'this'
    ? sourceNode.data.content
    : lodashGet(sourceNode.data.content, edge.sourceHandle);
};
