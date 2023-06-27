import lodashGet from 'lodash.get';
import { StateCreator } from 'zustand';

import { getFlowNodeById, getNodeContentById, getSafeFlowNodeById } from '@/helpers/flow';
import { getInputVariablesFromMessages } from '@/helpers/prompt';
import { LangChainParams } from '@/types/langchain';

import { notification } from '@/layout';
import { fetchLangChain } from '@/services/langChain';
import { fetchNetworkServe } from '@/services/networkServe';
import { fetchSDServe } from '@/services/sdServe';
import { AITaskContent, OutputNodeContent } from '@/types/flow';
import { SDTaskType } from '@/types/flow/node/sdTask';
import { genChatMessages } from '@/utils/genChatMessages';
import { message } from 'antd';
import { FlowBasicNode } from 'kitchen-flow-editor';
import { FlowStore } from '../action';
import { flowSelectors } from '../selectors';

export interface FlowRunnerSlice {
  runFlowNode: (nodeId: string) => Promise<void>;
  abortFlowNode: (id: string) => void;
  runFlow: () => void;
  cancelFlowNode: () => void;
}

const sizeToWidthAndHeight = (size: 'landing' | 'avatar' | '4:3') => {
  if (size === 'landing') return { width: 300, height: 512 };
  if (size === 'avatar') return { width: 120, height: 120 };
  if (size === '4:3') return { width: 400, height: 300 };
  return { width: 512, height: 512 };
};

// ====== Flow 节点运行 ======= //
export const runnerSlice: StateCreator<
  FlowStore,
  [['zustand/devtools', never]],
  [],
  FlowRunnerSlice
> = (set, get) => ({
  runFlowNode: async (nodeId) => {
    const flow = flowSelectors.currentFlow(get());
    if (!flow) return;

    const node = getFlowNodeById(flow, nodeId);
    const task = getNodeContentById(flow, nodeId);

    if (!task) {
      notification.primaryInfo({ message: '没有找到节点任务，请检查任务设置后重试' });
      return;
    }

    const vars: Record<string, string> = {};

    // 从关联节点中找到变量信息
    const links = Object.values(flow.flattenEdges || {}).filter((i) => i.target === nodeId);
    // 调用  langChain 接口
    const prompts = genChatMessages({
      systemRole: node.data.content.systemRole,
      messages: node.data.content.input,
    });
    // 设定变量默认值 为自己
    const inputVariables = getInputVariablesFromMessages(prompts);
    inputVariables.forEach((variable) => {
      vars[variable] = `{${variable}}`;
    });
    links.forEach(({ sourceHandle, source, targetHandle }) => {
      // 找到上游数据源
      const sourceNode = getFlowNodeById(flow, source);
      const sourceData =
        !sourceHandle || sourceHandle === 'this'
          ? sourceNode?.data?.content
          : lodashGet(sourceNode.data.content, sourceHandle);

      // TODO:看下这块逻辑有没有更好的实现方案
      const [, template] = (targetHandle || '').split(',');
      // 写入数据
      if (template) {
        vars[template] = sourceData;
      }
    });

    const { editor } = get();
    const abortController = new AbortController();
    editor.updateNodeState(node.id, 'abortController', abortController, { recordHistory: false });
    abortController.signal.onabort = () => {
      editor.updateNodeState(node.id, 'loading', false, { recordHistory: false });
    };

    // 节点类型如果是文生图，直接调用文生图接口
    if (node.type === 'sdTask') {
      const { editor } = get();
      const params = node.data.content as any as SDTaskType;
      let prompt = params.prompt.replace(/\{(.+?)\}/g, (match, p1) => {
        return lodashGet(vars, p1, match);
      });
      editor.updateNodeState(node.id, 'loading', true, { recordHistory: false });
      try {
        const data = (await fetchSDServe({
          ...params,
          prompt,
          output: '',
          ...sizeToWidthAndHeight(params.size),
        })) as {
          images: string[];
        };

        editor.updateNodeState(node.id, 'loading', false, { recordHistory: false });
        editor.updateNodeContent<AITaskContent>(
          node.id,
          'output',
          'data:image/png;base64,' + data.images.at(0),
          {
            recordHistory: false,
          },
        );
      } catch (error) {
        message.error('文生图接口调用失败');
        editor.updateNodeState(node.id, 'loading', false, { recordHistory: false });
      }
      return;
    }

    // 网络代理发送服务
    if (node.type === 'network') {
      const params = node.data.content as any as OutputNodeContent;
      let data: Record<string, any> = {};
      Object.keys(JSON.parse(params.data)).forEach((key) => {
        data[key] = lodashGet(vars, key);
      });

      editor.updateNodeState(node.id, 'loading', true, { recordHistory: false });

      try {
        const res = (await fetchNetworkServe({
          ...params,
          data: JSON.stringify(data),
        })) as unknown as {
          message: string;
        };
        editor.updateNodeState(node.id, 'loading', false, { recordHistory: false });
        editor.updateNodeContent<OutputNodeContent>(
          node.id,
          'output',
          JSON.stringify(res, null, 2),
          {
            recordHistory: false,
          },
        );
      } catch (error) {
        editor.updateNodeState(node.id, 'loading', false, { recordHistory: false });
        editor.updateNodeContent<OutputNodeContent>(
          node.id,
          'output',
          JSON.stringify({
            message: '网络代理接口调用失败',
          }),
          {
            recordHistory: false,
          },
        );
      }
      return;
    }

    const request: LangChainParams = {
      llm: { model: 'gpt3.5-turbo', temperature: 0.6 },
      prompts,
      vars,
    };

    let output = '';

    await fetchLangChain({
      params: request,
      onMessageHandle: (text) => {
        output += text;
        editor.updateNodeContent<AITaskContent>(node.id, 'output', output, {
          recordHistory: false,
        });
      },
      onLoadingChange: (loading) => {
        editor.updateNodeState(node.id, 'loading', loading, { recordHistory: false });
      },
      abortController,
    });
  },
  abortFlowNode: (nodeId) => {
    const agent = flowSelectors.currentFlow(get());
    if (!agent) return;

    const task = getSafeFlowNodeById(agent, nodeId);

    task?.data.state.abortController?.abort?.();

    // 结束全局任务
    const { cancelFlowNode } = get();
    cancelFlowNode?.();
  },
  cancelFlowNode: async () => {
    const { dispatchFlow } = get();
    const { id, flattenNodes } = flowSelectors.currentFlow(get());

    /**
     * 结束所有的任务
     */
    const { abortFlowNode } = get();
    for await (const node of Object.values(flattenNodes)) {
      await abortFlowNode(node.id);
    }

    dispatchFlow({ type: 'updateFlowState', id, state: { runningTask: false } });
  },
  runFlow: async () => {
    const { dispatchFlow } = get();
    const { id, flattenNodes } = flowSelectors.currentFlow(get());

    // 设定开始执行任务
    dispatchFlow({ type: 'updateFlowState', id, state: { runningTask: true } });

    let isAbort = false;

    const runFlowTreeNode = async (node: FlowBasicNode) => {
      try {
        await get().runFlowNode(node.id);
      } catch (e) {
        isAbort = true;
      }
      return;
    };

    for await (const node of Object.values(flattenNodes)) {
      if (isAbort) return;
      await runFlowTreeNode(node);
    }
    dispatchFlow({ type: 'updateFlowState', id, state: { runningTask: false } });
  },
});
