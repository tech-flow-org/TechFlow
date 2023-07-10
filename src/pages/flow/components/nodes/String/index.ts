import { SymbolMasterDefinition } from '@/types/flow';

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
      component: 'Input',
      handles: {
        target: true,
      },
    },
  },
};
