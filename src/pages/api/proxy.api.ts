import { OutputNodeContent } from '@/types/flow';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const payload = (await request.json()) as OutputNodeContent;

  try {
    const msg = await fetch(payload.url!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload.data,
    }).then((res) => {
      return res.json();
    });

    return new Response(
      JSON.stringify({
        message: '接口调用成功',
        data: msg,
      }),
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        message: '网络请求失败',
      }),
    );
  }
}
