import { OutputNodeContent, SymbolMasterDefinition } from '@/types/flow';

import Output from './Preview';
import Render from './Render';

export const OutputSymbol: SymbolMasterDefinition<OutputNodeContent> = {
  id: 'network',
  title: '网络节点',
  avatar: '🔗',
  description: '将接受到的结果输出到服务器',
  preview: Output,
  render: Render,
  defaultContent: {
    url: 'https://www.xxx.com/api',
    data: '{"images":"{images}","text":"{text}"}',
  },
};
