import lodashGet from 'lodash.get';
import { StateCreator } from 'zustand';

import { getFlowNodeById, getNodeContentById, getSafeFlowNodeById } from '@/helpers/flow';
import { getInputVariablesFromMessages } from '@/helpers/prompt';

import { notification } from '@/layout';
import { FlattenNodes, OutputNodeContent } from '@/types/flow';
import { genChatMessages } from '@/utils/genChatMessages';

import { SymbolNodeRunMap } from '@/pages/flow/components/nodes';
import { FlattenEdges } from 'kitchen-flow-editor';
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

//封装图类
class Graph {
  vertexes: string[];
  edges: Map<string, string[]>;
  constructor() {
    //属性：顶点(数组)/边(字典)
    this.vertexes = []; //顶点
    this.edges = new Map(); //边
  }

  addVertex(v: string) {
    this.vertexes.push(v);
    //将边添加到字典中，新增的顶点作为键，对应的值为一个存储边的空数组
    this.edges.set(v, []);
  }
  addEdge(v1: string, v2: string) {
    this.edges.get(v1)?.push(v2);
  }
  getPathForFirstToLast(last: string) {
    const path: string[] = [last];
    if (!this.edges.get(last)) return path;
    const next = this.edges.get(last);
    const findNextItem = (edgeList: string[]) => {
      edgeList.forEach((item) => {
        if (this.edges.get(item)) {
          path.push(item);
          findNextItem(this.edges.get(item) || []);
        }
      });
    };
    findNextItem(next || []);
    return path;
  }
  toString() {
    let resultString = '';
    for (let i = 0; i < this.vertexes.length; i++) {
      //遍历所有顶点
      resultString += this.vertexes[i] + '-->  ';
      let vEdges = this.edges.get(this.vertexes[i]) || [];
      for (let j = 0; j < vEdges.length; j++) {
        //遍历字典中每个顶点对应的数组
        resultString += vEdges[j] + ' ';
      }
      resultString += '\n';
    }
    return resultString;
  }
}

const getTaskList = (flattenNodes: FlattenNodes, flattenEdges: FlattenEdges) => {
  const graph = new Graph();
  const nodeList = Object.values(flattenNodes);
  nodeList.forEach((node) => {
    graph.addVertex(node.id);
  });

  const list = Object.values(flattenEdges).map((edge) => {
    graph.addEdge(edge.source, edge.target);
    return { source: edge.source, target: edge.target };
  });

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
  if (!firstItem) return [];

  return Array.from(new Set(graph.getPathForFirstToLast(firstItem.id)));
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
      editor.updateNodeContent<OutputNodeContent>(node.id, 'output', data.output);
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

    const taskList = getTaskList(flattenNodes, flattenEdges);
    // 准备任务列表
    dispatchFlow({ type: 'updateFlowState', id, state: { taskList } });
    // 设定开始执行任务
    dispatchFlow({ type: 'updateFlowState', id, state: { runningTask: true } });

    let isAbort = false;

    const runFlowTreeNode = async (nodeId: string) => {
      try {
        await get().runFlowNode(nodeId);
      } catch (e) {
        isAbort = true;
      }
      return;
    };

    const ruinedList = [];
    for await (const node of taskList) {
      if (isAbort) return;
      if (!node) return;
      await runFlowTreeNode(node);
      ruinedList.push(node);
    }
    dispatchFlow({ type: 'updateFlowState', id, state: { runningTask: false } });
    dispatchFlow({ type: 'updateFlowState', id, state: { currentTask: null } });
  },
});
