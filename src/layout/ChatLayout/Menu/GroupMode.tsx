import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { FC, memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { useSessionStore } from '@/store';

import AgentItem from './AgentList/AgentItem';
import ChatItem from './ChatList/ChatItem';

import { chatSelectors } from '@/store/session/selectors';
import { SessionTreeNode } from '@/types';

const useStyles = createStyles(({ css, token }) => ({
  chatBlock: css`
    border-bottom: 1px solid ${token.colorSplit};
  `,
}));

const Item: FC<SessionTreeNode> = memo(({ agentId, chats }) => {
  const { styles } = useStyles();
  const [activeId, summarizingTitle, autoNamingAgent] = useSessionStore(
    (s) => [s.activeId, s.summarizingTitle, s.addingAgentName],
    shallow,
  );

  return (
    <Flexbox key={agentId} gap={4} paddingBlock={4} className={styles.chatBlock}>
      <AgentItem
        loading={autoNamingAgent && agentId === activeId}
        id={agentId}
        active={agentId === activeId}
      />
      {chats.map((id) => (
        <ChatItem
          active={activeId === id}
          key={id}
          id={id}
          descType={'messages'}
          loading={summarizingTitle && id === activeId}
        />
      ))}
    </Flexbox>
  );
});

export const GroupMode = memo(() => {
  const sessionTree = useSessionStore(chatSelectors.sessionTree, isEqual);
  return (
    <>
      {sessionTree.map((s) => (
        <Item key={s.agentId} agentId={s.agentId} chats={s.chats} />
      ))}
    </>
  );
});
