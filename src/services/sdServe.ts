﻿import { URLS } from '@/services/url';
import { SDTaskType } from '@/types/flow/node/sdTask';

/**
 * 专门用于 FlowChain 的 fetch
 */
export const fetchSDServe = (params: SDTaskType) =>
  window
    .fetch(URLS.sd, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    .then((res) => res.json());