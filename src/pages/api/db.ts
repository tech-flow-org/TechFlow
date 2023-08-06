import { createKysely } from '@vercel/postgres-kysely';

export type MaskDataBase = Partial<{
  id?: string;
  name?: string;
  user_id?: string;
  avatar: string;
  context?: string;
  model_config?: string;
}>;

export type WorkFlowDataBase = Partial<{
  id?: string;
  user_id?: string;
  workflow?: string;
}>;

interface Database {
  mask: MaskDataBase;
  workflow: WorkFlowDataBase;
}

export const dataBase = createKysely<Database>();
