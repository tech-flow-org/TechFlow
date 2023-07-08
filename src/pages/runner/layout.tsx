import Head from 'next/head';
import { memo, useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import { Sidebar } from '@/features/Sidebar';
import { Menu } from '@/layout/FlowLayout/Menu';
import { useSettings } from '@/store';
import { flowSelectors, useFlowStore } from '@/store/flow';
import { createStyles } from 'antd-style';
import { FlowEditorProvider } from 'kitchen-flow-editor';
import React from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css }) => {
  return {
    layout: css`
      position: relative;
      width: 100%;
      padding: 24px;
      max-width: 60vw;
      margin: 0 auto;
      background-image: url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr');
      background-size: 100% 100%;
      background-position: left top;
      padding-bottom: 80px;
    `,
  };
});

const RunnerLayout: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const [title] = useFlowStore((s) => [flowSelectors.currentFlowMeta(s).title], shallow);

  useEffect(() => {
    useSettings.setState({ sidebarKey: 'runner' });
  }, []);

  const { styles } = useStyles();

  return (
    <FlowEditorProvider>
      <>
        <Head>
          <title>{title ? `正在执行 ${title} - DrawingBoard` : '节点运行 - DrawingBoard'}</title>
        </Head>
        <Flexbox id={'RunnerLayout'} horizontal width={'100%'} height={'100%'}>
          <Sidebar />
          <Menu prefixPath="runner" />
          <div className={styles.layout}>{props.children}</div>
        </Flexbox>
      </>
    </FlowEditorProvider>
  );
};

export default memo(RunnerLayout);
