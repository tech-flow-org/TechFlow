import { URLS } from '@/services/url';
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
      body: JSON.stringify({
        negative_prompt:
          'EasyNegative, NSFW, 2faces, 4eyes, 3arms, 4arms, 3legs, 4legs, hand, foot, naked, penis, pussy, sex, porn, 1gril, 1boy, human, logo, text, watermark ',
        ...params,
      }),
    })
    .then((res) => res.json());
