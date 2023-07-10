import { initAITaskContent } from '@/store/flow/initialState';
import { AITaskData, FlowAITaskNode, Workflow } from '@/types/flow';
import { MetaData } from '@/types/meta';
import { produce } from 'immer';

interface AddFlowNodeAction {
  type: 'addNode';
  node: FlowAITaskNode;
}

interface RemoveFlowNodeAction {
  type: 'removeNode';
  id: string;
}

interface UpdateFlowDataAction {
  type: 'updateFlowData';
  key: keyof Omit<Workflow, 'flattenNodes'>;
  value: any;
}

interface UpdateFlowNodeAction {
  type: 'updateNode';
  id: string;
  key: keyof Omit<FlowAITaskNode, 'data' | 'id'>;
  value: any;
}

interface UpdateFlowNodeDataAction {
  type: 'updateNodeData';
  id: string;
  key: keyof FlowAITaskNode['data'];
  value: any;
}
interface UpdateFlowNodeMetaAction {
  type: 'updateNodeMeta';
  id: string;
  key: keyof MetaData;
  value: any;
}
interface UpdateFlowNodeStateAction {
  type: 'updateNodeState';
  id: string;
  key: keyof AITaskData['state'];
  value: any;
}

interface UpdateNodeContent<T> {
  type: 'updateNodeContent';
  id: string;
  key: keyof T;
  value: any;
}

export type FlowNodeDispatch =
  | AddFlowNodeAction
  | RemoveFlowNodeAction
  | UpdateFlowNodeDataAction
  | UpdateFlowNodeAction
  | UpdateFlowDataAction
  | UpdateNodeContent<any>
  | UpdateFlowNodeMetaAction
  | UpdateFlowNodeStateAction;

export const flowNodesReducer = (state: Workflow, payload: FlowNodeDispatch): Workflow => {
  switch (payload.type) {
    case 'addNode':
      return produce(state, (draft) => {
        const { node } = payload;
        if (!draft.flattenNodes[node.id]) {
          draft.flattenNodes[node.id] = node;
        }
      });

    case 'removeNode':
      return produce(state, (draft) => {
        const { id } = payload;

        delete draft.flattenNodes[id];
      });

    case 'updateNode':
      return produce(state, (draft) => {
        const { id, value, key } = payload;
        const node = draft.flattenNodes[id];
        if (!node) return;

        if (!['data', 'id'].includes(key as string)) node[key] = value as never;
      });

    case 'updateFlowData':
      return produce(state, (draft) => {
        const { key, value } = payload;
        draft[key] = value as never;
      });

    case 'updateNodeData':
      return produce(state, (draft) => {
        const { id, value, key } = payload;
        const node = draft.flattenNodes[id];
        if (!node) return;

        node.data[key] = value as never;
      });

    case 'updateNodeMeta':
      return produce(state, (draft) => {
        const { id, value, key } = payload;
        const node = draft.flattenNodes[id];
        if (!node) return;

        node.data.meta[key] = value;
      });

    case 'updateNodeState':
      return produce(state, (draft) => {
        const { id, value, key } = payload;
        const node = draft.flattenNodes[id];
        if (!node) return;

        node.data.state[key] = value;
      });

    case 'updateNodeContent':
      return produce(state, (draft) => {
        const { id, key, value } = payload;
        const node = draft.flattenNodes[id];
        if (!node) return;

        if (node.data.content) node.data.content[key] = value as never;
        else {
          node.data.content = { ...initAITaskContent, [key]: value };
        }
      });

    default:
      throw Error('不存在的 type，请检查代码实现...');
  }
};
