import { URLS } from '@/services/url';
import { OutputNodeContent } from '@/types/flow';

/**
 * 专门用于 FlowChain 的 fetch
 */
export const fetchNetworkServe = (params: OutputNodeContent) =>
  window
    .fetch(URLS.network, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    .then((res) => res.json());
