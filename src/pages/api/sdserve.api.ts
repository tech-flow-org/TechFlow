export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const payload = await request.json();
  const msg = await fetch('http://127.0.0.1:7861/sdapi/v1/txt2img', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((res) => {
    return res.json();
  });
  try {
    return new Response(JSON.stringify(msg));
  } catch (e) {
    const error = JSON.stringify((e as Error).cause);

    return new Response(error, { status: 501, statusText: error });
  }
}
