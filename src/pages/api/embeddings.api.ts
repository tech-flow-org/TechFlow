import { OPENAI_SERVICE_ERROR_CODE } from '@/const/fetch';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { TokenTextSplitter } from 'langchain/text_splitter';

export const config = {
  runtime: 'edge',
};

export type DocumentsLoadPayload = {
  document: string;
};

export default async function handler(request: Request) {
  const payload = (await request.json()) as DocumentsLoadPayload;

  const splitter = new TokenTextSplitter({
    encodingName: 'gpt2',
    chunkSize: 1000,
    chunkOverlap: 0,
  });

  const output = await splitter.createDocuments(
    payload.document?.split('\n').filter((item) => item !== ''),
  );

  let documents = [];

  const embeddings = new OpenAIEmbeddings({
    timeout: 100000, // 1s timeout
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  for await (const document of output) {
    documents.push({
      ...document,
      embeddings: await embeddings.embedQuery(document.pageContent),
    });
  }

  try {
    return new Response(
      JSON.stringify({
        success: true,
        data: { output: documents },
      }),
    );
  } catch (e) {
    const error = JSON.stringify((e as Error).cause);

    return new Response(error, { status: OPENAI_SERVICE_ERROR_CODE, statusText: error });
  }
}
