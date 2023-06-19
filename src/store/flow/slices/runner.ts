import lodashGet from 'lodash.get';
import { StateCreator } from 'zustand';

import { getFlowNodeById, getNodeContentById, getSafeFlowNodeById } from '@/helpers/flow';
import { getInputVariablesFromMessages } from '@/helpers/prompt';
import { LangChainParams } from '@/types/langchain';

import { notification } from '@/layout';
import { fetchLangChain } from '@/services/langChain';
import { AITaskContent } from '@/types/flow';
import { genChatMessages } from '@/utils/genChatMessages';
import { FlowStore } from '../action';
import { flowSelectors } from '../selectors';

export interface FlowRunnerSlice {
  runFlowNode: (nodeId: string) => Promise<void>;
  abortFlowNode: (id: string) => void;
  runFlow: () => void;
}

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

    const prompts = genChatMessages({
      systemRole: node.data.content.systemRole,
      messages: node.data.content.input,
    });
    // 设定变量默认值 为自己
    const inputVariables = getInputVariablesFromMessages(prompts);
    inputVariables.forEach((variable) => {
      vars[variable] = `{${variable}}`;
    });

    // 从关联节点中找到变量信息
    const links = Object.values(flow.flattenEdges || {}).filter((i) => i.target === nodeId);

    links.forEach(({ sourceHandle, source, targetHandle }) => {
      // 找到上游数据源
      const sourceNode = getFlowNodeById(flow, source);
      const sourceData =
        !sourceHandle || sourceHandle === 'this'
          ? sourceNode.data.content
          : lodashGet(sourceNode.data.content, sourceHandle);

      // TODO:看下这块逻辑有没有更好的实现方案
      const [, template] = (targetHandle || '').split(',');
      // 写入数据
      if (template) {
        vars[template] = sourceData;
      }
    });

    const request: LangChainParams = {
      llm: { model: 'gpt3.5-turbo', temperature: 0.6 },
      prompts,
      vars,
    };

    let output = '';

    const { editor } = get();
    const abortController = new AbortController();
    editor.updateNodeState(node.id, 'abortController', abortController, { recordHistory: false });

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
    editor.updateNodeState(node.id, 'abortController', undefined, { recordHistory: false });
  },
  abortFlowNode: (nodeId) => {
    const agent = flowSelectors.currentFlow(get());
    if (!agent) return;

    const task = getSafeFlowNodeById(agent, nodeId);

    task?.data.state.abortController?.abort();
  },

  runFlow: async () => {
    const { dispatchFlow } = get();
    const {
      // flowTree,
      id,
    } = flowSelectors.currentFlow(get());

    // 设定开始执行任务
    dispatchFlow({ type: 'updateFlowState', id, state: { runningTask: true } });

    // let isAbort = false;

    // const runFlowTreeNode = async (node: FlowTreeNode) => {
    //   try {
    //     await get().runFlowNode(node.id);
    //   } catch (e) {
    //     isAbort = true;
    //   }
    //
    //   const pools = node.children.map(runFlowTreeNode);
    //   await Promise.all(pools);
    // };

    // const pools = flowTree.map(async (node) => {
    //   if (isAbort) return;
    //   await runFlowTreeNode(node);
    // });
    // await Promise.all(pools);

    // dispatchFlow({ type: 'updateFlowState', id, state: { runningTask: false } });
  },
});
