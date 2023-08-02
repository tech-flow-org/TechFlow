import { URLS } from '@/services/url';
import { OutputNodeContent } from '@/types/flow';

/**
 * 专门用于 FlowChain 的 fetch
 */
export const fetchDingDingBotServe = (params: OutputNodeContent) =>
  window
    .fetch(URLS.dingdingbot, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    .then((res) => res.json());
