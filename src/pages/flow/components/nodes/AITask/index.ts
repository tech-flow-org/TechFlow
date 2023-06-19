import { createAITaskContent, createNode } from '@/helpers/flow';
import { initAITaskContent } from '@/store/flow/initialState';
import { ChatAgent, LLMModel } from '@/types';
import { AITaskContent, SymbolMasterDefinition } from '@/types/flow';
import Preview from './Preview';
import Render from './Render';

export const AITaskSymbol: SymbolMasterDefinition<AITaskContent> = {
  id: 'aiTask',
  title: 'AI节点',
  avatar: '🤖',
  description: '使用大模型处理任务',
  preview: Preview,
  render: Render,
  defaultContent: initAITaskContent,

  onCreateNode: (node, activeData) => {
    if (activeData?.source === 'agent') {
      const agent = activeData as unknown as ChatAgent;
      return createNode(
        node,
        createAITaskContent({
          llm: { model: agent.model || LLMModel.GPT3_5 },
          systemRole: agent.content,
        }),
        agent,
      );
    }

    return createNode(node, initAITaskContent, { title: 'AI 节点' });
  },
};
