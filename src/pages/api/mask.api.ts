import { Mask } from '@/store/mask';
import { createKysely } from '@vercel/postgres-kysely';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth].api';

interface Database {
  mask: Mask & {
    userId: string;
  };
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
    const maskList = await db
      .selectFrom('mask')
      .where('userId', '=', session?.user?.email)
      .execute();

    response.status(200).json({
      success: true,
      data: maskList,
    });
  }

  if (request.method === 'POST') {
    const mask = request.body as Mask;
    const result = await db
      .insertInto('mask')
      .values({
        ...mask,
        userId: session?.user?.email,
      })
      .execute();

    return response.status(200).json({
      success: true,
      data: result,
    });
  }

  if (request.method === 'DELETE') {
    const mask = request.body as Mask;
    const result = await db.deleteFrom('mask').where('id', '=', mask.id).execute();
    return response.status(200).json({
      success: true,
      data: result,
    });
  }

  if (request.method === 'PUT') {
    const mask = request.body as Mask;
    const result = await db.updateTable('mask').set(mask).where('id', '=', mask.id).execute();
    return response.status(200).json({
      success: true,
      data: result,
    });
  }

  return response.status(200).json({
    success: false,
    data: [],
  });
}
