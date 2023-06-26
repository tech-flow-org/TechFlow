import { SymbolMasterDefinition } from '@/types/flow';
import Preview from './Preview';
import Render from './Render';

export const SDTaskSymbol: SymbolMasterDefinition<{
  modal: string;
  width: number;
  height: number;
}> = {
  id: 'sdTask',
  title: '文生图节点',
  avatar: '🧑‍🎨',
  description: '使用 SD 绘图',
  preview: Preview,
  render: Render,
  defaultContent: {
    modal: 'chilloutmix_NiPrunedFp32Fix',
    width: 512,
    height: 512,
  },
};
