import { FlowStore } from '@/store/flow/action';
import { IFlowBasicNode } from '@ant-design/pro-flow-editor';
import { FC } from 'react';
import { XYPosition } from 'reactflow';

export interface OutputNodeContent {
  params?: Record<string, any>;
  data: string;
  url: string;
  outputType?: 'text' | 'img' | 'json';
  variable?: string;
  output?: string;
}

export type DingDingBotNodeContent = {
  title?: string;
  data: string;
  url: string;
};

export type FileReadNodeContent = {
  file: string;
  type: 'pdf' | 'txt' | 'csv';
};

type ActionType<Content> = {
  // 当前任务流实例
  flow: FlowStore;
  // 更新当前 节点 的 loading 的状态
  updateLoading: (loading: boolean) => void;
  // 当前节点实例
  node: IFlowBasicNode<Content>;
  // 停止的 AbortController 实例
  abortController?: AbortController;
  // 更新当前节点的参数
  updateParams: (params: Record<string, any>) => void;
  // 更新当前节点的输出
  updateOutput: (output: { output: string; type: OutputNodeContent['outputType'] }) => void;
};

export type OnCreateNode<T> = (
  node: { id: string; position: XYPosition; type: string },
  active: { source: 'agent' | 'symbol' } & Record<string, any>,
) => T;

export interface SymbolMasterDefinition<Content> {
  id: string;
  title: string;
  description: string;
  group: string;
  avatar: string;
  preview?: FC<any>;
  render?: FC<any>;
  defaultContent: Content;
  schema: Record<
    string,
    {
      type: 'input' | 'output';
      title: string;
      valueContainer?: boolean;
      hideContainer?: boolean;
      valueKey?: string[];
      component?:
        | 'Input'
        | 'Var'
        | 'VarList'
        | 'Segmented'
        | 'InputArea'
        | 'SystemRole'
        | 'TaskPromptsInput'
        | 'Upload';
      options?: {
        label: string;
        value: string;
      }[];
      handles?: {
        source?: true | string;
        target?: true | string;
      };
    }
  >;
  onCreateNode?: OnCreateNode<IFlowBasicNode<Content>>;
  run?: (
    content: Content,
    vars: Record<string, any>,
    options: ActionType<Content>,
  ) => Promise<{
    type: OutputNodeContent['outputType'];
    output: string;
    code?: string;
    message?: string;
  }>;
  outputRender?: (output: string, node: Content) => React.ReactNode;
}
