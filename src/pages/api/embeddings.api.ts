import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

import { OPENAI_SERVICE_ERROR_CODE } from '@/const/fetch';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI');
}
export const config = {
  runtime: 'edge',
};

type OpenAIEmbeddingsPayload = {
  query: string;
};

export default async function handler(request: Request) {
  const payload = (await request.json()) as OpenAIEmbeddingsPayload;
  const embeddings = new OpenAIEmbeddings({
    timeout: 10000, // 1s timeout
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const res = await embeddings.embedQuery(payload.query);

  try {
    return new Response(
      JSON.stringify({
        success: true,
        data: { output: res },
      }),
    );
  } catch (e) {
    const error = JSON.stringify((e as Error).cause);

    return new Response(error, { status: OPENAI_SERVICE_ERROR_CODE, statusText: error });
  }
}
