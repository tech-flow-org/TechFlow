import { DocumentsLoadPayload } from '@/pages/api/embeddings.api';
import { fetchEmbeddings } from '@/services/embeddings';
import { SymbolMasterDefinition } from '@/types/flow';

export interface EmbeddingsNodeContent {
  document: string;
}

export const EmbeddingsSymbol: SymbolMasterDefinition<EmbeddingsNodeContent> = {
  id: 'embeddings',
  title: '向量化',
  description: '将文本向量化，用于后续的处理',
  avatar: '▶',
  defaultContent: { document: '{document}' },
  schema: {
    document: {
      type: 'input',
      title: '文档内容',
      valueContainer: false,
      component: 'Var',
      handles: {
        target: true,
      },
    },
  },
  run: async (_, vars, { updateLoading, updateParams }) => {
    updateLoading(true);
    const res = await fetchEmbeddings(vars as DocumentsLoadPayload);
    updateParams(vars);
    updateLoading(false);
    return {
      output: res,
      type: 'text',
    };
  },
};
