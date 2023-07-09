import { FlowStore } from '@/store/flow/action';
import { IFlowBasicNode } from 'kitchen-flow-editor';
import { FC } from 'react';
import { XYPosition } from 'reactflow';

export interface OutputNodeContent {
  params?: Record<string, any>;
  data: string;
  url: string;
  variable?: string;
  output?: string;
}

export type OnCreateNode<T> = (
  node: { id: string; position: XYPosition; type: string },
  active: { source: 'agent' | 'symbol' } & Record<string, any>,
) => T;

export interface SymbolMasterDefinition<Content> {
  id: string;
  title: string;
  description: string;
  avatar: string;
  preview: FC<any>;
  render: FC<any>;
  defaultContent: Content;
  schema: Record<
    string,
    {
      type: 'input' | 'output';
      title: string;
      valueContainer?: boolean;
      hideContainer?: boolean;
      valueKey?: string[];
      component?: 'Input' | 'Segmented' | 'InputArea' | 'SystemRole' | 'TaskPromptsInput';
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
  run: (
    node: Content,
    vars: Record<string, any>,
    options: {
      flow: FlowStore;
      updateLoading: (loading: boolean) => void;
      node: IFlowBasicNode<Content>;
      abortController?: AbortController;
      updateParams: (params: Record<string, any>) => void;
    },
  ) => Promise<{
    type: 'img' | 'text';
    output: string;
  }>;
  outputRender: (output: string, node: Content) => React.ReactNode;
}
