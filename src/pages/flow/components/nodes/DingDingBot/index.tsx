import { fetchDingDingBotServe } from '@/services/dingdingbotServe';
import { DingDingBotNodeContent, SymbolMasterDefinition } from '@/types/flow';
import lodashGet from 'lodash.get';

export const DingDingBotSymbol: SymbolMasterDefinition<DingDingBotNodeContent> = {
  id: 'dingdingbot',
  title: '钉钉机器人',
  avatar: '🔗',
  description: '将接受到的结果以 md 格式发送给钉钉',
  defaultContent: {
    url: 'https://oapi.dingtalk.com/robot/send?access_token=xxxx',
    data: '## ${name} \n ${result}',
    title: '钉钉机器人',
  },
  schema: {
    url: {
      type: 'input',
      component: 'Input',
      title: '钉钉机器人 hooks 地址',
    },
    data: {
      type: 'input',
      component: 'InputArea',
      title: 'Markdown',
    },
    title: {
      type: 'input',
      component: 'InputArea',
      title: 'Markdown 标题',
    },
  },
  run: async (node, vars, { updateParams }) => {
    const title = node?.title!.replace(/\{(.+?)\}/g, (match, p1) => {
      return lodashGet(vars, p1, match);
    });
    const data = node?.data!.replace(/\{(.+?)\}/g, (match, p1) => {
      return lodashGet(vars, p1, match);
    });

    const params = {
      ...node,
      title,
      data,
      output: undefined,
      params: undefined,
    };
    updateParams(params);
    const res = (await fetchDingDingBotServe(params)) as unknown as {
      message: string;
    };
    return {
      type: 'json',
      output: JSON.stringify(res, null, 2),
    };
  },
};
