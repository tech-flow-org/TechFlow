import { fetchNetworkServe } from '@/services/networkServe';
import { OutputNodeContent, SymbolMasterDefinition } from '@/types/flow';
import lodashGet from 'lodash.get';

export const NetworkSymbol: SymbolMasterDefinition<OutputNodeContent> = {
  id: 'network',
  title: '网络节点',
  avatar: '🔗',
  group: '输出节点',
  description: '将接受到的结果输出到服务器',
  defaultContent: {
    url: 'http://127.0.0.1:8001/api/data',
    data: '{"images":"{images}","text":"{text}"}',
  },
  schema: {
    url: {
      type: 'input',
      component: 'Input',
      title: 'URL',
    },
    data: {
      type: 'input',
      component: 'InputArea',
      title: '数据',
    },
  },
  run: async (node, vars, { updateParams }) => {
    let data: Record<string, any> = {};
    Object.keys(JSON.parse(`{${node.data}}`)).forEach((key) => {
      data[key] = lodashGet(vars, key);
    });
    const params = { ...node, output: undefined, params: undefined, data: JSON.stringify(data) };
    updateParams(params);
    const res = (await fetchNetworkServe(params)) as unknown as {
      message: string;
    };
    return {
      type: 'json',
      output: JSON.stringify(res, null, 2),
    };
  },
};
