import { QdrantClient } from '@qdrant/js-client-rest';
import OpenAI from 'openai';
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI');
}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_API_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const payload = (await request.json()) as {
    body: string;
    title: string;
  };

  return new Response(
    new ReadableStream({
      async start(controller) {
        const embedding = await openai.embeddings
          .create({
            input: payload.title,
            model: 'text-embedding-ada-002',
          })
          .then((res) => {
            return res.data.at(0)?.embedding;
          });
        const encoder = new TextEncoder();

        controller.enqueue(encoder.encode(''));
        const searchResult = await qdrantClient.search('test_collection', {
          vector: embedding || [],
          limit: 1,
        });

        controller.enqueue(encoder.encode(''));
        const chatData = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo-16k',
          messages: [
            {
              role: 'system',
              content: ` 你是一个专业的前端答疑专家，你需要基于前端知识来做出让初学者都能听懂的回答，
              并且保证技术都是先进的，比如样式修改要用
              - DesginToken 而不是使用 less
              - react  要用 hooks
              - 不推荐使用 dva 和  redux`,
            },
            {
              role: 'user',
              content: `基于以下片段，简明扼要的回复 ${payload.title + payload.body} 的问题
  ${searchResult.map((item) => `- ${item?.payload?.text}`).join('\n')})}`,
            },
          ],
          stream: true,
          temperature: 0.9,
        });

        for await (const part of chatData) {
          controller.enqueue(encoder.encode(part.choices[0]?.delta?.content || ''));
        }
      },
    }),
  );
}
