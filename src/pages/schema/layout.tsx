import { Sidebar } from '@/features/Sidebar';
import { createStyles } from 'antd-style';
import Head from 'next/head';
import React from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css }) => {
  return {
    layout: css`
      position: relative;
      width: 100%;
      padding: 0px;
      margin: 0 auto;
    `,
  };
});

export const SchemaLayout: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const { styles } = useStyles();

  return (
    <>
      <Head>
        <title>{'节点编辑'}</title>
      </Head>
      <Flexbox
        id={'RunnerLayout'}
        horizontal
        width={'100%'}
        height={'100%'}
        onKeyDown={(e) => {
          if (e.key === 's' && e.ctrlKey) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === 's' && e.ctrlKey) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
      >
        <Sidebar />
        <div className={styles.layout}>{props.children}</div>
      </Flexbox>
    </>
  );
};
