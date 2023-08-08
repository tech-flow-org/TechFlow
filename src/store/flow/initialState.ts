import { AITaskContent, FlowAITaskNode, Workflow, WorkflowMap } from '@/types/flow';
import { FlowEditorInstance } from '@ant-design/pro-flow-editor';

export type FlowDisplayMode = 'ouput' | 'nodes';

export interface FlowState {
  activeId: string | null;
  keywords: string;
  showNodeManager: boolean;
  nodeManagerKeywords: string;
  displayMode: FlowDisplayMode;
  flows: WorkflowMap;
  loading?: boolean;
  terminalHeight: number;
  showTerminal: boolean;
  editor: FlowEditorInstance;
}

export const initAITaskContent: AITaskContent = {
  mode: 'prompt',
  llm: {
    model: 'gpt-3.5-turbo',
  },
  systemRole: '',
  input: [{ role: 'user', content: '' }],
  output: '',
};

export const initAITaskNode: FlowAITaskNode = {
  id: '',
  data: {
    id: '',
    content: initAITaskContent,
    state: {
      collapsedKeys: [],
    },
    meta: {},
  },
  position: {
    x: 0,
    y: 0,
  },
};

export const initialFlow: Workflow = {
  id: 'default',
  flattenNodes: {},
  flattenEdges: {},
  meta: {},
  state: {
    viewport: {
      x: 0,
      y: 0,
      zoom: 1,
    },
  },
  outputTemplate: '',
  previewInput: '',
};

export const initialState: FlowState = {
  activeId: null,
  keywords: '',
  displayMode: 'nodes',
  flows: {},
  loading: false,
  showNodeManager: true,
  nodeManagerKeywords: '',
  terminalHeight: 0,
  showTerminal: false,
  editor: {} as FlowEditorInstance,
};
