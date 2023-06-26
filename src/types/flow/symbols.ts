import { FlowBasicNode } from 'kitchen-flow-editor';
import { FC } from 'react';
import { XYPosition } from 'reactflow';

export interface OutputNodeContent {
  variable: string;
  preview?: boolean;
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
  onCreateNode?: OnCreateNode<FlowBasicNode<Content>>;
}
