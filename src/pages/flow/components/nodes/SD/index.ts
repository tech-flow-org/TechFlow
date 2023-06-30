import { SymbolMasterDefinition } from '@/types/flow';
import Preview from './Preview';
import Render from './Render';

export const SDTaskSymbol: SymbolMasterDefinition<{
  modal: string;
  width: number;
  height: number;
  hr_scale: number;
  enable_hr: boolean;
  negative_prompt: string;
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
    hr_scale: 2,
    enable_hr: true,
    negative_prompt:
      'EasyNegative, NSFW, 2faces, 4eyes, 3arms, 4arms, 3legs, 4legs, hand, foot, naked, penis, pussy, sex, porn, 1gril, 1boy, human, logo, text, watermark ',
  },
};
