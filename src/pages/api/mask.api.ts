import { Mask } from '@/store/mask';
import { createKysely } from '@vercel/postgres-kysely';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth].api';

type MaskDataBase = Partial<{
  id?: string;
  name?: string;
  user_id?: string;
  avatar: string;
  context?: string;
  model_config?: string;
}>;
interface Database {
  mask: MaskDataBase;
}

const db = createKysely<Database>();

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
      const maskList = await db
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
    await db.insertInto('mask').values(insertValue).execute();

    return response.status(200).json({
      success: true,
      data: insertValue,
    });
  }

  if (request.method === 'DELETE') {
    const mask = request.query as MaskDataBase;
    await db
      .deleteFrom('mask')
      .where('id', '=', mask.id?.toString() || '')
      .execute();
    return response.status(200).json({
      success: true,
      data: {},
    });
  }

  if (request.method === 'PUT') {
    const mask = request.body as MaskDataBase;
    const result = await db
      .updateTable('mask')
      .set(mask)
      .where('id', '=', mask.id?.toString() || '')
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
