import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useSessionStore } from '@/store';

import Header from '@/components/Header';
import ChatLayout from '@/layout/ChatLayout';
import { agentSelectors } from '@/store/session/selectors';
import { Typography } from 'antd';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';
import { AgentDetail } from './AgentDetail';

const Agent: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (typeof id === 'string' && !useSessionStore.getState().activeId) {
      useSessionStore.setState({ activeId: id });
    }
  }, [id]);

  const [title, mode] = useSessionStore(
    (s) => [agentSelectors.currentAgentSlicedTitle(s), s.displayMode],
    shallow,
  );
  useEffect(() => {
    if (mode === 'chat') useSessionStore.setState({ displayMode: 'agent' });
  }, []);

  return (
    <>
      <Head>
        <title>{title ? `${title} - DrawingBoard` : '角色设定'}</title>
      </Head>
      <ChatLayout>
        <Header />
        <Flexbox>
          <Typography.Title level={4}>角色设定</Typography.Title>
          <Typography.Text type={'secondary'}>
            为 AI 设定场景化的角色后能更好地响应你的需求。基于不同角色就可以串联多种应用场景。
          </Typography.Text>
        </Flexbox>
        <AgentDetail />
      </ChatLayout>
    </>
  );
};

export default Agent;
