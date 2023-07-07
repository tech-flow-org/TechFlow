import { Typography } from 'antd';
import Head from 'next/head';
import { Flexbox } from 'react-layout-kit';
import { AgentDetail } from './components/AgentDetail';
import { MaskLayout } from './layout';

function MaskPage() {
  return (
    <MaskLayout>
      <Head>
        <title>新建角色</title>
      </Head>
      <div
        style={{
          padding: 64,
          maxHeight: '100vh',
          width: '100%',
          overflow: 'auto',
        }}
      >
        <Flexbox flex={1} align="start">
          <Flexbox>
            <Typography.Title level={4}>角色设定</Typography.Title>
            <Typography.Text type={'secondary'}>
              为 AI 设定场景化的角色后能更好地响应你的需求。基于不同角色就可以串联多种应用场景。
            </Typography.Text>
          </Flexbox>
          <AgentDetail />
        </Flexbox>
      </div>
    </MaskLayout>
  );
}

export default MaskPage;
