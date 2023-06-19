import { OutputNodeContent, SymbolMasterDefinition } from '@/types/flow';

import Output from './Preview';
import Render from './Render';

export const OutputSymbol: SymbolMasterDefinition<OutputNodeContent> = {
  id: 'result',
  title: '输出节点',
  avatar: '🖨',
  description: '将接收到的结果汇总到输出',
  preview: Output,
  render: Render,
  defaultContent: {
    variable: '',
    preview: false,
  },
};
