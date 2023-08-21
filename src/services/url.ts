const isDev = process.env.NODE_ENV === 'development';

const prefix = isDev ? '-dev' : '';

export const URLS = {
  openai: '/api/openai' + prefix,
  chain: '/api/chain' + prefix,
  sd: '/api/sd/text2img',
  mask: '/api/mask',
  workflow: '/api/workflow',
  embeddings: '/api/embeddings' + prefix,
  network: '/api/network/proxy',
  dingdingbot: '/api/dingding/send',
};
