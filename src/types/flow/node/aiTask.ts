import { ModelConfig } from '@/store/mask';
import { IFlowBasicNodeData } from 'kitchen-flow-editor';
import { Node } from 'reactflow';
import type { ChatExample } from '../../agent';

export interface AITaskContent {
  llm: ModelConfig;
  systemRole: string;
  input: ChatExample;
  output: string;
  collapsed?: boolean;
  mode?: 'prompt' | 'chat';
}
// 流程图中每个智能体的定义
export interface AITaskData extends IFlowBasicNodeData {
  content: AITaskContent;
}

/**
 * 智能体流程节点
 * @template T - 聊天代理数据的子集，不包括 id 字段
 */
export type FlowAITaskNode = Node<AITaskData>;
