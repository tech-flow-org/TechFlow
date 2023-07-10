import { createAITaskContent, createNode } from '@/helpers/flow';
import { fetchLangChain } from '@/services/langChain';
import { initAITaskContent } from '@/store/flow/initialState';
import { ALL_MODELS } from '@/store/mask';
import { ChatAgent } from '@/types';
import { AITaskContent, SymbolMasterDefinition } from '@/types/flow';
import { LangChainParams } from '@/types/langchain';
import { genChatMessages } from '@/utils/genChatMessages';

export const AITaskSymbol: SymbolMasterDefinition<AITaskContent> = {
  id: 'aiTask',
  title: 'AI节点',
  avatar: '🤖',
  description: '使用大模型处理任务',
  defaultContent: initAITaskContent,
  schema: {
    model: {
      type: 'input',
      valueKey: ['llm', 'model'],
      component: 'Segmented',
      title: '模型',
      options: ALL_MODELS.map((model) => ({
        label: model.name,
        value: model.name,
      })),
      valueContainer: false,
    },
    systemRole: {
      type: 'input',
      hideContainer: true,
      component: 'SystemRole',
      title: '角色定义',
      valueContainer: false,
    },
    input: {
      type: 'input',
      component: 'TaskPromptsInput',
      title: '运行输入',
      hideContainer: true,
      valueContainer: false,
    },
  },
  onCreateNode: (node, activeData) => {
    if (activeData?.source === 'agent') {
      const agent = activeData as unknown as ChatAgent;
      return createNode(
        node,
        createAITaskContent({
          llm: { model: 'gpt-3.5-turbo' },
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
        action.updateOutput({
          output,
          type: 'text',
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
};
