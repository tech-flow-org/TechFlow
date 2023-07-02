import { fetchSDServe } from '@/services/sdServe';
import { SymbolMasterDefinition } from '@/types/flow';
import { SDTaskType } from '@/types/flow/node/sdTask';
import lodashGet from 'lodash.get';
import Preview from './Preview';
import Render from './Render';

const sizeToWidthAndHeight = (size: 'landing' | 'avatar' | '4:3') => {
  if (size === 'landing') return { width: 300, height: 512 };
  if (size === 'avatar') return { width: 120, height: 120 };
  if (size === '4:3') return { width: 400, height: 300 };
  return { width: 512, height: 512 };
};

export const SDTaskSymbol: SymbolMasterDefinition<SDTaskType> = {
  id: 'sdTask',
  title: '文生图节点',
  avatar: '🧑‍🎨',
  description: '使用 SD 绘图',
  preview: Preview,
  render: Render,
  defaultContent: {
    model: 'chilloutmix_NiPrunedFp32Fix',
    width: 512,
    height: 512,
    hr_scale: 2,
    prompt: '{{input}}',
    enable_hr: true,
    negative_prompt:
      'EasyNegative, NSFW, 2faces, 4eyes, 3arms, 4arms, 3legs, 4legs, hand, foot, naked, penis, pussy, sex, porn, 1gril, 1boy, human, logo, text, watermark ',
  },
  run: async (node, vars) => {
    let prompt = node?.prompt!.replace(/\{(.+?)\}/g, (match, p1) => {
      return lodashGet(vars, p1, match);
    });
    const data = (await fetchSDServe({
      ...node,
      prompt,
      output: '',
      ...sizeToWidthAndHeight(node.size!),
    })) as {
      images: string[];
    };

    return {
      type: 'img',
      output: 'data:image/png;base64,' + data.images.at(0),
    };
  },
};
