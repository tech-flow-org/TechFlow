import { Viewport } from 'reactflow';

import { MetaData } from '@/types/meta';
import { FlattenEdges, IFlowBasicNode } from '@ant-design/pro-flow-editor';

export type FlattenNodes = Record<string, IFlowBasicNode>;

export interface ResultVariable {
  name: string;
  nodeId?: string;
  sourceId?: string;
  contentKey?: string;
}

export interface Workflow {
  // 元数据
  /**
   * 角色 ID
   */
  id: string;
  updateAt?: number;
  createAt?: number;
  meta: MetaData;

  /**
   * 节点
   */
  flattenNodes: FlattenNodes;
  flattenEdges: FlattenEdges;
  /**
   * 如果有关联 agent 则需要记录 agentId
   */
  agentId?: string;

  state: {
    viewport?: Viewport;
    runningTask?: boolean;
    taskList?: string[];
    loading?: boolean;
    currentTask?:
      | (IFlowBasicNode & {
          params: Record<string, any>;
          result: Record<string, any>;
        })
      | null;
    importModalOpen?: boolean;
  };

  outputTemplate: string;
  previewInput?: string;
}

export type WorkflowMeta = MetaData & Pick<Workflow, 'id' | 'createAt' | 'updateAt'>;

export type WorkflowMap = Record<string, Workflow>;
