import { getFlowNodeById, getNodeContentById } from '@/helpers/flow';
import { getInputVariablesFromMessages } from '@/helpers/prompt';
import { SYMBOL_NODE_LIST, SymbolNodeRunMap } from '@/pages/flow/components/nodes';
import { FlattenNodes, OutputNodeContent, Workflow } from '@/types/flow';
import { genChatMessages } from '@/utils/genChatMessages';
import { FlattenEdges, IFlowBasicNode } from '@ant-design/pro-flow-editor';
import lodashGet from 'lodash.get';

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

  return Array.from(new Set(graph.getPathForFirstToLast(firstItem.id).reverse())).reverse();
};

class NodeListRunner {
  symbolNodeList: typeof SYMBOL_NODE_LIST;
  host: string;
  flow: Workflow;
  onRunNodeEnd: (nodeId: string, output: OutputNodeContent) => void = () => {};
  onRunNodeStart: (nodeId: string, params: Record<string, any>) => void = () => {};
  constructor({
    symbolNodeList,
    host,
    flow,
    onRunNodeStart,
    onRunNodeEnd,
  }: {
    symbolNodeList: typeof SYMBOL_NODE_LIST;
    host?: string;
    flow: Workflow;
    onRunNodeStart: (nodeId: string, params: Record<string, any>) => void;
    onRunNodeEnd: (nodeId: string, params: Record<string, any>) => void;
  }) {
    this.symbolNodeList = symbolNodeList;
    this.host = host || 'https://techflow.antdigital.dev/';
    this.flow = flow;
    this.onRunNodeStart = onRunNodeStart;
    this.onRunNodeEnd = onRunNodeEnd;
  }

  loading?: boolean;

  paramsMap?: Map<string, Record<string, any>> = new Map();

  outputMap?: Map<string, OutputNodeContent> = new Map();

  currentTask?: IFlowBasicNode & {
    params: Record<string, any>;
    result: Record<string, any>;
  };

  abortController?: AbortController;

  abort() {
    this.abortController?.abort();
    this.isAbort = true;
  }

  reset() {
    this.currentTask = undefined;
    this.loading = false;
    this.paramsMap?.clear();
    this.outputMap?.clear();
  }

  async runNode(nodeId: string) {
    const flow = this.flow;
    if (!flow) return;
    const node = flow.flattenNodes[nodeId];
    const task = getNodeContentById(flow, nodeId);

    if (!task) {
      return {
        status: 'error',
        message: '没有找到节点任务，请检查任务设置后重试',
      };
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
      if (!sourceNode) return;
      const sourceData =
        !sourceHandle || sourceHandle === 'this'
          ? sourceNode.data?.content
          : lodashGet(sourceNode.data?.content, sourceHandle);

      // TODO:看下这块逻辑有没有更好的实现方案
      const [, template] = (targetHandle || '').split(',');
      // 写入数据
      if (template) {
        vars[template] = sourceData;
      }
    });
    const abortController = new AbortController();

    const nodeData = node.data.content as any as OutputNodeContent;
    try {
      const run = SymbolNodeRunMap[node.type as 'aiTask'];
      if (!run) return;

      const data = await run?.(nodeData, vars, {
        abortController,
        node,
        updateLoading: (loading) => {
          this.loading = loading;
        },
        updateParams: (params) => {
          this.paramsMap?.set(node.id, params);
          this.onRunNodeStart(node.id, params);
        },
        updateOutput: (data: { output: string; type?: 'text' | 'img' | 'json' }) => {
          this.outputMap?.set(node.id, {
            ...nodeData,
            ...data,
          });
          this.onRunNodeEnd(node.id, {
            ...nodeData,
            ...data,
          });
        },
      });

      this.currentTask = {
        ...node,
        params: vars,
        result: data,
      };

      if (data.code) {
        console.error(`[${data.code}] ${data.message}`);
        this.loading = false;
        return {
          status: 'error',
          message: `[${data.code}] ${data.message}`,
        };
      }
      this.outputMap?.set(node.id, {
        ...nodeData,
        ...data,
      });
      this.onRunNodeEnd(node.id, {
        ...nodeData,
        ...data,
      });
    } catch (error) {
      this.loading = false;
      this.outputMap?.set(node.id, {
        params: vars,
        data: '',
        url: '',
        output: JSON.stringify(
          {
            message: `调用 ${node?.data?.meta?.title || '节点'} 接口失败`,
          },
          null,
          2,
        ),
      });
    }
  }

  /**
   * isAbort 用于判断是否中断
   *
   * @memberof NodeListRunner
   */
  isAbort = false;

  async run() {
    this.reset();
    this.isAbort = false;
    const taskList = getTaskList(this.flow.flattenNodes, this.flow.flattenEdges);
    const runFlowTreeNode = async (nodeId: string) => {
      try {
        await this.runNode(nodeId);
      } catch (e) {
        this.isAbort = true;
      }
      return;
    };

    const ruinedList = [];
    for await (const node of taskList) {
      if (this.isAbort) return;
      if (!node) return;
      await runFlowTreeNode(node);
      ruinedList.push(node);
    }
  }
}

module.exports = NodeListRunner;
