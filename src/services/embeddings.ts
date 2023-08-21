import { DocumentsLoadPayload } from '@/pages/api/embeddings.api';
import { URLS } from '@/services/url';

/**
 * 专门用于 FlowChain 的 fetch
 */
export const fetchEmbeddings = (params: DocumentsLoadPayload) =>
  window
    .fetch(URLS.embeddings, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    .then((res) => res.json());
