import { IFlowBasicNodeData } from 'kitchen-flow-editor';
import { Node } from 'reactflow';
import type { ChatExample } from '../../agent';
import { LLMModel } from '../../agent';

export interface AITaskContent {
  llm: {
    /**
     * 角色所使用的 LLM 模型
     * @description 可选参数，如果不传则使用默认模型
     */
    model?: LLMModel;
  };
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
