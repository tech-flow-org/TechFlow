import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { useSessionStore } from '@/store';

import ChatItem from './ChatItem';

import { chatSelectors } from '@/store/session/selectors';

export const ChatList = memo(() => {
  const [list, activeId, summarizingTitle] = useSessionStore(
    (s) => [chatSelectors.chatList(s), s.activeId, s.summarizingTitle],
    shallow,
  );

  return (
    <>
      {list.map(({ id }) => (
        <Flexbox key={id} gap={4} paddingBlock={4}>
          <ChatItem
            active={activeId === id}
            key={id}
            id={id}
            loading={summarizingTitle && id === activeId}
          />
        </Flexbox>
      ))}
    </>
  );
});
