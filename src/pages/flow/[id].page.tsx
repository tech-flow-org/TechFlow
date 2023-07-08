import { createStyles } from 'antd-style';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { memo, useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import FlowLayout from '@/layout/FlowLayout';

import { flowSelectors, useFlowStore } from '@/store/flow';

import FlowView from './components/FlowView';
import Header from './components/Header';
import Panel from './components/Panel';
import Terminal from './components/Terminal';

const useStyles = createStyles(({ css }, terminalHeight: number = 300) => {
  const canvasHeight = `calc(100vh - 50px - ${terminalHeight}px)`;
  return {
    layout: css`
      position: relative;

      display: grid;
      grid-template-areas:
        'header header'
        'flow panel'
        'terminal terminal';
      grid-template-columns: 1fr auto;
      grid-template-rows: 50px ${canvasHeight} ${terminalHeight}px;

      width: 100%;
    `,
  };
});

const Flow: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const terminalHeight = useFlowStore((s) => s.terminalHeight);
  const { styles } = useStyles(terminalHeight);
  useEffect(() => {
    if (typeof id === 'string') {
      useFlowStore.setState({ activeId: id });
    }
  }, [id]);

  useEffect(() => {
    return () => {
      useFlowStore.setState({ activeId: undefined });
    };
  }, []);

  const [title] = useFlowStore((s) => [flowSelectors.currentFlowMeta(s).title], shallow);

  return (
    <>
      <Head>
        <title>{title ? `${title} - DrawingBoard` : '流程编排 - DrawingBoard'}</title>
      </Head>
      <FlowLayout>
        <div className={styles.layout}>
          <Header />
          <FlowView />
          <Panel />
          <Terminal />
        </div>
      </FlowLayout>
    </>
  );
};

export default memo(Flow);
