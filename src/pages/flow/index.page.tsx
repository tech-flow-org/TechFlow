import type { NextPage } from 'next';
import Head from 'next/head';
import { memo } from 'react';
import { Center } from 'react-layout-kit';

import FlowLayout from '@/layout/FlowLayout';
import { Empty } from 'antd';

const Flow: NextPage = () => {
  return (
    <>
      <Head>
        <title>DrawingBoard</title>
      </Head>
      <FlowLayout>
        <Center flex={1} horizontal>
          <Empty description={'新建任务流或基于角色新建'} />
        </Center>
      </FlowLayout>
    </>
  );
};

export default memo(Flow);
