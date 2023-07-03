import Markdown from '@/components/Markdown';
import { createAITaskContent, createNode } from '@/helpers/flow';
import { fetchLangChain } from '@/services/langChain';
import { initAITaskContent } from '@/store/flow/initialState';
import { ChatAgent, LLMModel } from '@/types';
import { AITaskContent, SymbolMasterDefinition } from '@/types/flow';
import { LangChainParams } from '@/types/langchain';
import { genChatMessages } from '@/utils/genChatMessages';
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
  run: async (node, vars, action) => {
    const prompts = genChatMessages({
      systemRole: node.systemRole,
      messages: node.input,
    });
    const request: LangChainParams = {
      llm: { model: 'gpt3.5-turbo', temperature: 0.6 },
      prompts,
      vars,
    };
    action.updateParams(request);
    let output = '';

    await fetchLangChain({
      params: request,
      onMessageHandle: (text) => {
        output += text;
        action.flow.editor.updateNodeContent<AITaskContent>(action.node.id, 'output', output, {
          recordHistory: false,
        });
      },
      onLoadingChange: (loading) => {
        action.updateLoading(loading);
      },
      abortController: action.abortController,
    });

    return {
      type: 'text',
      output,
    };
  },
  outputRender: (output: string) => {
    return <Markdown>{output}</Markdown>;
  },
};
