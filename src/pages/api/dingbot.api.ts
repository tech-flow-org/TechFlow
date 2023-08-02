import { DingDingBotNodeContent } from '@/types/flow';
import * as Robot from 'dingtalk-robot-sdk';
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const payload = (await request.json()) as DingDingBotNodeContent;
  const Markdown = Robot.Markdown;

  let markDown = new Markdown();

  markDown = markDown.setTitle(payload.title!);

  payload.data.split('\n').forEach((item) => {
    markDown = markDown.add(item + '\n\n\n');
  });

  try {
    const msg = await fetch(payload.url!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(markDown.get()),
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
