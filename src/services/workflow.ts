import { WorkFlowDataBase } from '@/pages/api/db';
import { URLS } from '@/services/url';
import { fetchServeFactory } from '@/utils/fetch';

export const createWorkFlowDataBase = fetchServeFactory<WorkFlowDataBase, WorkFlowDataBase>(
  (params, signal?: AbortSignal | undefined) =>
    fetch(URLS.workflow, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      signal,
    }),
);

export const queryWorkFlowDataBaseList = fetchServeFactory<undefined, WorkFlowDataBase[]>(
  (signal?: AbortSignal | undefined) =>
    fetch(URLS.workflow, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    }),
);

export const updateWorkFlowDataBase = fetchServeFactory<WorkFlowDataBase, WorkFlowDataBase>(
  (params: WorkFlowDataBase, signal?: AbortSignal | undefined) =>
    fetch(URLS.workflow, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      signal,
    }),
);

export const deleteWorkFlowDataBase = fetchServeFactory<WorkFlowDataBase, WorkFlowDataBase>(
  (params: WorkFlowDataBase, signal?: AbortSignal | undefined) =>
    fetch(URLS.workflow + '?id=' + params.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      signal,
    }),
);
