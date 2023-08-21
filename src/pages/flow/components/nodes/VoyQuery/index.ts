import { SymbolMasterDefinition } from '@/types/flow';
import type { Voy } from 'voy-search';

export interface EmbeddingsNodeContent {
  document: string;
  query: string;
}

let database: null | Voy = null;

export const VoyQuerySymbol: SymbolMasterDefinition<EmbeddingsNodeContent> = {
  id: '一个基于 WASM 的在线向量数据库',
  title: '向量数据库',
  description: '将向量文档存入数据库，并进行查询',
  avatar: '📚',
  defaultContent: { document: '{document}', query: '{query}' },
  schema: {
    query: {
      type: 'input',
      title: '查询内容',
      valueContainer: false,
      component: 'Var',
    },
    document: {
      type: 'input',
      title: '文档内容',
      valueContainer: false,
      component: 'Var',
    },
  },
  run: async (_, vars, { updateLoading, updateParams }) => {
    updateLoading(true);
    const document = JSON.parse(vars.document);
    const { Voy } = await import('voy-search');
    if (!database) {
      database = new Voy({
        embeddings: [],
      });
    } else {
      database.clear();
    }

    const resource = {
      embeddings: document.map(
        (
          item: {
            embeddings: number[];
            pageContent: string;
          },
          index: number,
        ) => {
          return {
            id: String(index),
            title: item.pageContent,
            url: `/path/${index}`,
            embeddings: item.embeddings,
          };
        },
      ),
    };
    database.add(resource);
    const query = JSON.parse(vars.query);
    const result = database.search(query.at(0).embeddings, 2);
    updateParams(vars);
    updateLoading(false);
    return {
      output: JSON.stringify(
        result.neighbors.map((value) => {
          return {
            id: value.id,
            title: value.title,
          };
        }),
        null,
        2,
      ),
      type: 'json',
    };
  },
};
