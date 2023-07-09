import { SymbolMasterDefinition } from '@/types/flow';

import Preview from './Preview';
import Render from './Render';

export interface StringNodeContent {
  text: string;
}

export const StringSymbol: SymbolMasterDefinition<StringNodeContent> = {
  id: 'string',
  title: '文本',
  description: '纯文本输入节点',
  avatar: '📝',
  defaultContent: { text: '' },
  schema: {
    text: {
      type: 'input',
      title: '文本',
      valueContainer: false,
      component: 'InputArea',
      handles: {
        target: true,
      },
    },
  },
  preview: Preview,
  render: Render,
  run: async (node) => {
    return {
      type: 'text',
      output: node.text,
    };
  },
  outputRender: (output) => {
    return output;
  },
};
