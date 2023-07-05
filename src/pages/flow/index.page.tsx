import FlowLayout from '@/layout/FlowLayout';
import { Empty } from 'antd';
import type { NextPage } from 'next';
import Head from 'next/head';
import { memo } from 'react';
import { Center } from 'react-layout-kit';

const Flow: NextPage = () => {
  return (
    <>
      <Head>
        <title>Drawing Board</title>
      </Head>
      <FlowLayout>
        <Center flex={1} horizontal>
          <Empty description={'新建任务流'} />
        </Center>
      </FlowLayout>
    </>
  );
};

export default memo(Flow);
