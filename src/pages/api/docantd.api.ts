import { QdrantClient } from '@qdrant/js-client-rest';
import { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const payload = (await request.body) as {
    body: string;
    title: string;
  };

  const embedding = await openai.embeddings
    .create({
      input: payload.title,
      model: 'text-embedding-ada-002',
    })
    .then((res) => {
      return res.data.at(0)?.embedding;
    });

  const searchResult = await qdrantClient.search('test_collection', {
    vector: embedding || [],
    limit: 3,
  });

  const chatData = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    messages: [
      {
        role: 'system',
        content: ` 你是一个专业的前端答疑专家，你需要基于前端知识来做出让初学者都能听懂的回答`,
      },
      {
        role: 'user',
        content: `基于以下片段，回答 ${payload.title} 的问题
${searchResult.map((item) => `- ${item?.payload?.text}`).join('\n')})}`,
      },
    ],
    stream: false,
    temperature: 0.9,
  });

  return response.send(
    JSON.stringify({
      message: chatData.choices[0]?.message?.content,
      success: true,
    }),
  );
}
