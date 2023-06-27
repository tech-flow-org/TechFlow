export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const payload = await request.json();
  try {
    const msg = await fetch('http://30.183.80.45/sdapi/v1/txt2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then((res) => {
      return res.json();
    });

    return new Response(JSON.stringify(msg));
  } catch (e) {
    const error = JSON.stringify((e as Error).cause);
    return new Response(error, { status: 501, statusText: error });
  }
}
