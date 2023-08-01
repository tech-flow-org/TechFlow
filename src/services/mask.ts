import { URLS } from '@/services/url';
import { Mask } from '@/store/mask';
import { fetchServeFactory } from '@/utils/fetch';

export const createMask = fetchServeFactory<Mask, Mask>(
  (params, signal?: AbortSignal | undefined) =>
    fetch(URLS.mask, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      signal,
    }),
);

export const queryMaskList = fetchServeFactory<undefined, Mask[]>(
  (signal?: AbortSignal | undefined) =>
    fetch(URLS.mask, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    }),
);

export const updateMask = fetchServeFactory<Mask, Mask>(
  (params: Mask, signal?: AbortSignal | undefined) =>
    fetch(URLS.mask, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      signal,
    }),
);

export const deleteMask = fetchServeFactory<Mask, Mask>(
  (params: Mask, signal?: AbortSignal | undefined) =>
    fetch(URLS.mask + '?id=' + params.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      signal,
    }),
);
