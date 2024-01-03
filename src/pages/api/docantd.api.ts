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

        controller.enqueue(
          encoder.encode(
            `> 值得注意是的百分之二十的问题都可以用重装依赖来解决，所以你可以尝试一下：
删除 'node_modules' 文件夹 -> 删除 'package-lock.json'或 'pnpm-lock.yaml' 文件 -> 运行 'pnpm install' 或  'npm install' 命令`,
          ),
        );
        const chatData = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo-16k',
          messages: [
            {
              role: 'system',
              content: ` 你是一个专业的前端答疑专家，你需要基于前端知识来做一步步的给出解决方案，请根据以下问题来回答：
我们需要你基于以下知识来回答：
  - 前端知识
  - 前端开发流程
  - 前端工程化
  - 前端性能优化
  - React  技术
  - Umi  和  antd
请注意，我们需要你对前端技术有一定的了解，并且能够在短时间内给出一个解决方案，并且保证技术都是先进的
  `,
            },
            {
              role: 'user',
              content: `基于以下片段，简明扼要的一步步的给出${
                payload.title + payload.body
              } 问题的解决方案 
  ${searchResult.map((item) => `- ${item?.payload?.text}`).join('\n')})}`,
            },
          ],
          stream: true,
          temperature: 0.9,
        });

        for await (const part of chatData) {
          controller.enqueue(controller.enqueue(part.choices[0]?.delta?.content || ''));
        }
      },
    }),
  );
}
