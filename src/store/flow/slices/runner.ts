import lodashGet from 'lodash.get';
import { StateCreator } from 'zustand';

import { getFlowNodeById, getNodeContentById, getSafeFlowNodeById } from '@/helpers/flow';
import { getInputVariablesFromMessages } from '@/helpers/prompt';

import { notification } from '@/layout';
import { OutputNodeContent } from '@/types/flow';
import { genChatMessages } from '@/utils/genChatMessages';

import { SymbolNodeRunMap } from '@/pages/flow/components/nodes';
import { FlowBasicNode } from 'kitchen-flow-editor';
import { FlowStore } from '../action';
import { flowSelectors } from '../selectors';

export interface FlowRunnerSlice {
  runFlowNode: (nodeId: string) => Promise<void>;
  abortFlowNode: (id: string) => void;
  /**
   * 运行所有节点
   * @returns
   */
  runFlow: () => void;
  /**
   * 取消所有节点的运行
   * @returns
   */
  cancelFlowNode: () => void;
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
    const { editor, dispatchFlow } = get();
    const abortController = new AbortController();
    editor.updateNodeState(node.id, 'abortController', abortController, { recordHistory: false });
    abortController.signal.onabort = () => {
      editor.updateNodeState(node.id, 'loading', false, { recordHistory: false });
    };

    const nodeData = node.data.content as any as OutputNodeContent;
    try {
      editor.updateNodeState(node.id, 'loading', true, { recordHistory: false });
      const flowId = flowSelectors.currentFlow(get()).id;
      dispatchFlow({
        type: 'updateFlowState',
        id: flowId,
        state: {
          currentTask: {
            ...node,
            params: vars,
            result: {},
          },
        },
      });
      const data = await SymbolNodeRunMap[node.type as 'string']?.(nodeData, vars, {
        flow: get(),
        abortController,
        node,
        updateLoading: (loading) => {
          editor.updateNodeState(node.id, 'loading', loading, { recordHistory: false });
        },
        updateParams: (params) => {
          editor.updateNodeContent<OutputNodeContent>(node.id, 'params', params);
        },
      });

      dispatchFlow({
        type: 'updateFlowState',
        id: flowId,
        state: {
          currentTask: {
            ...node,
            params: vars,
            result: data,
          },
        },
      });
      editor.updateNodeContent<OutputNodeContent>(node.id, 'output', data.output, {
        recordHistory: false,
      });
    } catch (error) {
      editor.updateNodeState(node.id, 'loading', false, { recordHistory: false });
      editor.updateNodeContent<OutputNodeContent>(
        node.id,
        'output',
        JSON.stringify(
          {
            message: `调用 ${node?.data?.meta?.title || '节点'} 接口失败`,
          },
          null,
          2,
        ),
        {
          recordHistory: false,
        },
      );
    }
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
    for await (const node of Object.values(flattenNodes)) {
      const agent = flowSelectors.currentFlow(get());
      if (!agent) return;
      const task = getSafeFlowNodeById(agent, node.id);
      task?.data.state.abortController?.abort?.();
    }
    dispatchFlow({ type: 'updateFlowState', id, state: { runningTask: false } });
  },
  runFlow: async () => {
    const { dispatchFlow } = get();
    const { id, flattenNodes, flattenEdges } = flowSelectors.currentFlow(get());
    const list = Object.values(flattenEdges).map((edge) => {
      return { source: edge.source, target: edge.target };
    });

    const nodeList = Object.values(flattenNodes);
    const firstItem = nodeList.find((item) => {
      const hasTarget = list.some((edge) => {
        if (edge.target === item.id) {
          return true;
        }
        return false;
      });
      if (hasTarget) return false;
      return true;
    });
    if (!firstItem) return;
    const taskSortIndex: Record<string, number> = {};
    const taskListSort: FlowBasicNode[][] = [];
    let thisNode = [firstItem];
    taskListSort.push([firstItem]);
    taskSortIndex[firstItem.id] = 0;
    // 以 firstItem 对节点进行排序
    list.forEach((_, index) => {
      thisNode.forEach((nodeItem) => {
        let thisNodeList: FlowBasicNode[] = [];
        list.forEach((item) => {
          if (item.source === nodeItem?.id) {
            thisNodeList.push(flattenNodes[item.target]);
          }
        });
        taskSortIndex[nodeItem.id] = index;
        thisNode = thisNodeList;
        taskListSort.push(thisNodeList);
      });
    });

    const taskList: string[] = [];

    Object.keys(taskSortIndex).forEach((node) => {
      taskList[taskSortIndex[node]] = node;
    });

    // 准备任务列表
    dispatchFlow({ type: 'updateFlowState', id, state: { taskList } });
    // 设定开始执行任务
    dispatchFlow({ type: 'updateFlowState', id, state: { runningTask: true } });

    let isAbort = false;

    const runFlowTreeNode = async (node: string) => {
      try {
        await get().runFlowNode(node);
      } catch (e) {
        isAbort = true;
      }
      return;
    };

    for await (const node of taskList) {
      if (isAbort) return;
      await runFlowTreeNode(node);
    }
    dispatchFlow({ type: 'updateFlowState', id, state: { runningTask: false } });
    dispatchFlow({ type: 'updateFlowState', id, state: { currentTask: null } });
  },
});
