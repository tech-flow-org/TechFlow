import { URLS } from '@/services/url';

/**
 * 专门用于 FlowChain 的 fetch
 */
export const fetchSDServe = (params: {
  prompt: string;
  width: number;
  height: number;
  output?: string;
}) =>
  window.fetch(URLS.sd, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
