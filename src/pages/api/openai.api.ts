import { OPENAI_SERVICE_ERROR_CODE } from '@/const/fetch';
import { OpenAIStream, OpenAIStreamPayload } from './OpenAIStream';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI');
}

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const payload = (await request.json()) as OpenAIStreamPayload;

  try {
    return new Response(OpenAIStream(payload));
  } catch (e) {
    const error = JSON.stringify((e as Error).cause);

    return new Response(error, { status: OPENAI_SERVICE_ERROR_CODE, statusText: error });
  }
}
