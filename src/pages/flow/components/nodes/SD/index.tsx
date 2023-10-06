import { fetchSDServe } from '@/services/sdServe';
import { SymbolMasterDefinition } from '@/types/flow';
import { SDTaskType } from '@/types/flow/node/sdTask';
import lodashGet from 'lodash.get';

const sizeToWidthAndHeight = (size: 'landing' | 'avatar' | '4:3') => {
  if (size === 'landing') return { width: 300, height: 512 };
  if (size === 'avatar') return { width: 120, height: 120 };
  if (size === '4:3') return { width: 400, height: 300 };
  return { width: 512, height: 512 };
};

export const SDTaskSymbol: SymbolMasterDefinition<SDTaskType> = {
  id: 'sdTask',
  title: '文生图节点',
  group: 'AI 节点',
  avatar: '🧑‍🎨',
  description: '使用 SD 绘图',
  schema: {
    model: {
      type: 'input',
      component: 'Segmented',
      options: [
        {
          title: '二次元',
          model_name: 'camelliamix_v20',
          hash: '2eb0c2a23a',
          sha256: '2eb0c2a23ab412553c0f26001bc683d9229c78b6eb35880dd8074873a986457f',
          filename: 'D:\\github\\good\\models\\Stable-diffusion\\camelliamix_v20.safetensors',
        },
        {
          title: 'anything',
          model_name: 'v1-5-pruned-emaonly',
          hash: '6ce0161689',
          sha256: '6ce0161689b3853acaa03779ec93eafe75a02f4ced659bee03f50797806fa2fa',
        },
        {
          title: '真人',
          model_name: 'chilloutmix_NiPrunedFp32Fix',
          hash: 'fc2511737a',
          sha256: 'fc2511737a54c5e80b89ab03e0ab4b98d051ab187f92860f3cd664dc9d08b271',
        },
      ].map((item) => {
        return {
          label: item.title,
          key: item.model_name,
          value: item.model_name,
        };
      }),
      title: '模型',
    },
    size: {
      title: '尺寸',
      type: 'input',
      component: 'Segmented',
      options: [
        {
          label: '落地页',
          value: 'landing',
        },
        {
          label: '头像',
          value: 'avatar',
        },
        {
          label: '4:3',
          value: '4:3',
        },
      ],
    },
    prompt: {
      type: 'input',
      component: 'InputArea',
      title: '正向提示词',
    },
    negative_prompt: {
      type: 'input',
      component: 'InputArea',
      title: '反向提示词',
    },
  },
  defaultContent: {
    model: 'chilloutmix_NiPrunedFp32Fix',
    width: 512,
    height: 512,
    hr_scale: 2,
    prompt: '{input}',
    enable_hr: true,
    negative_prompt:
      'EasyNegative, NSFW, 2faces, 4eyes, 3arms, 4arms, 3legs, 4legs, hand, foot, naked, penis, pussy, sex, porn, 1gril, 1boy, human, logo, text, watermark ',
  },
  run: async (node, vars, { updateParams }) => {
    let prompt = node?.prompt!.replace(/\{(.+?)\}/g, (match, p1) => {
      return lodashGet(vars, p1, match);
    });
    const params = {
      ...node,
      prompt,
      output: undefined,
      params: undefined,
      ...sizeToWidthAndHeight(node.size!),
    };
    updateParams(params);
    const data = (await fetchSDServe(params)) as {
      images: string[];
      code: string;
      message: string;
    };
    if (!data.images) {
      return {
        type: 'text',
        output: '',
        message: data.message,
        code: data.code,
      };
    }
    return {
      type: 'img',
      output: 'data:image/png;base64,' + data.images.at(0),
    };
  },
};
