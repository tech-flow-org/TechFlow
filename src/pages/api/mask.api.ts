import { Mask } from '@/store/mask';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth].api';
import { MaskDataBase, dataBase } from './db';

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
      const maskList = await dataBase
        .selectFrom('mask')
        .select(['id', 'name', 'avatar', 'context', 'model_config'])
        .where('mask.user_id', '=', session?.user?.email)
        .execute();

      response.status(200).json({
        success: true,
        data: maskList.map((mask) => ({
          ...mask,
          context: JSON.parse(mask.context || '[]'),
          modelConfig: JSON.parse(mask.model_config || '{}'),
        })),
      });
    } catch (error) {
      return response.status(200).json({
        success: false,
        data: [],
        error: 'serve error' + error,
      });
    }
    return;
  }

  if (request.method === 'POST') {
    const mask = request.body as Mask;
    const insertValue = {
      id: mask.id?.toString() || '',
      name: mask.name,
      avatar: mask.avatar,
      context: JSON.stringify(mask.context),
      user_id: session?.user?.email,
      model_config: JSON.stringify(mask.modelConfig),
    };
    await dataBase.insertInto('mask').values(insertValue).execute();

    response.status(200).json({
      success: true,
      data: insertValue,
    });
    return;
  }

  if (request.method === 'DELETE') {
    const mask = request.query as MaskDataBase;
    await dataBase
      .deleteFrom('mask')
      .where('id', '=', mask.id?.toString() || '')
      .execute();
    response.status(200).json({
      success: true,
      data: {},
    });
    return;
  }

  if (request.method === 'PUT') {
    const mask = request.body as MaskDataBase;
    const result = await dataBase
      .updateTable('mask')
      .set(mask)
      .where('id', '=', mask.id?.toString() || '')
      .execute();
    response.status(200).json({
      success: true,
      data: { result },
    });
    return;
  }

  return response.status(200).json({
    success: false,
    data: [],
  });
}
