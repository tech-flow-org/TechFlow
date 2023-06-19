import { Empty } from 'antd';
import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { useSessionStore } from '@/store';
import { chatSelectors } from '@/store/session/selectors';

import FolderPanel from '@/features/FolderPanel';
import { AgentList } from './AgentList';
import { ChatList } from './ChatList';
import { GroupMode } from './GroupMode';
import Header from './Header';

export const useStyles = createStyles(({ css }) => ({
  center: css`
    overflow-x: hidden;
    overflow-y: scroll;
    padding-inline: 4px 0;
  `,
}));

export const Sessions = memo(() => {
  const { styles, cx } = useStyles();

  const [mode, isEmpty] = useSessionStore(
    (s) => [s.displayMode, chatSelectors.sessionTree(s).length === 0],
    shallow,
  );

  return (
    <FolderPanel>
      <Flexbox gap={8} height={'100%'}>
        <Header />
        {isEmpty ? (
          <Empty
            style={{ marginTop: '40vh' }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={'列表空空如也...'}
          />
        ) : (
          <Flexbox className={cx(styles.center)}>
            {mode === 'chat' ? <ChatList /> : mode === 'agent' ? <AgentList /> : <GroupMode />}
          </Flexbox>
        )}
      </Flexbox>
    </FolderPanel>
  );
});
