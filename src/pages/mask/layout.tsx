import { Sidebar } from '@/features/Sidebar';
import Head from 'next/head';
import { Flexbox } from 'react-layout-kit';

export const MaskLayout: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  return (
    <>
      <Head>
        <title>角色市场</title>
      </Head>
      <Flexbox id={'RunnerLayout'} horizontal width="100%" height={'100%'}>
        <Sidebar />
        {props.children}
      </Flexbox>
    </>
  );
};
