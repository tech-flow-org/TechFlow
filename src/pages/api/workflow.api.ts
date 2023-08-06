import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth].api';
import { WorkFlowDataBase, dataBase } from './db';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const session = await getServerSession(request, response, authOptions);
  if (!session?.user?.email) {
    return response.status(200).json({
      success: false,
      data: [],
      error: 'Not logged in',
    });
  }
  if (request.method === 'GET') {
    try {
      const workflowList = await dataBase
        .selectFrom('workflow')
        .select(['id', 'workflow'])
        .where('workflow.user_id', '=', session?.user?.email)
        .execute();

      response.status(200).json({
        success: true,
        data: workflowList,
      });
    } catch (error) {
      return response.status(200).json({
        success: false,
        data: [],
        error: 'serve error' + error,
      });
    }
  }

  if (request.method === 'POST') {
    const workflow = request.body as WorkFlowDataBase;
    workflow.user_id = session?.user?.email;
    await dataBase.insertInto('workflow').values(workflow).execute();
    return response.status(200).json({
      success: true,
      data: workflow,
    });
  }

  if (request.method === 'DELETE') {
    const workflow = request.query as WorkFlowDataBase;
    await dataBase
      .deleteFrom('workflow')
      .where('id', '=', workflow.id?.toString() || '')
      .execute();
    return response.status(200).json({
      success: true,
      data: {},
    });
  }

  if (request.method === 'PUT') {
    const workflow = request.body as WorkFlowDataBase;
    const result = await dataBase
      .updateTable('workflow')
      .set(workflow)
      .where('id', '=', workflow.id?.toString() || '')
      .execute();
    return response.status(200).json({
      success: true,
      data: { result },
    });
  }

  return response.status(200).json({
    success: false,
    data: [],
  });
}
