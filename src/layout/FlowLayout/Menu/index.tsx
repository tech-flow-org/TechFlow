import { createStyles } from 'antd-style';
import React, { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import FolderPanel from '../../../features/FolderPanel';
import FlowList from './FlowList';

import Header from './Header';

export const useStyles = createStyles(({ css }) => ({
  center: css`
    overflow-x: hidden;
    overflow-y: scroll;
    padding-inline: 4px 0;
  `,
}));

export const Menu: React.FC<{ prefixPath: string }> = memo((props) => {
  const { styles, cx } = useStyles();

  return (
    <FolderPanel>
      <Flexbox gap={8} height={'100%'}>
        <Header />
        <Flexbox className={cx(styles.center)}>
          <FlowList {...props} />
        </Flexbox>
      </Flexbox>
    </FolderPanel>
  );
});
