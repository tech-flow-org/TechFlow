import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import isEqual from 'fast-deep-equal';
import { FC, memo } from 'react';
import { shallow } from 'zustand/shallow';

import CardListItem from '@/components/CardListItem';
import { IconAction } from '@/components/IconAction';
import { getSafeAgent } from '@/helpers/agent';
import { useSessionStore } from '@/store';

interface ChatItemProps {
  active: boolean;
  id: string;
  loading: boolean;
  descType?: 'agent' | 'messages';
}

const ChatItem: FC<ChatItemProps> = memo(({ id, active, loading, descType = 'agent' }) => {
  const { title, messages, updateAt } = useSessionStore((s) => s.chats[id] || {}, isEqual);

  const agent = useSessionStore((s) => getSafeAgent(s.agents, s.chats[id]?.agentId), isEqual);

  const [switchChat, removeChat] = useSessionStore((s) => [s.switchChat, s.removeChat], shallow);

  const desc =
    descType === 'agent' ? agent.title || agent.content || '默认角色' : messages?.[0]?.content;

  return (
    <CardListItem
      active={active}
      showAction={active}
      title={title || messages?.[0].content}
      loading={loading}
      description={desc}
      onClick={() => {
        switchChat(id);
      }}
      date={updateAt}
      renderActions={
        <Popconfirm
          title={'确认要删除这条记录吗？'}
          okButtonProps={{ danger: true }}
          okText={'删除'}
          onConfirm={() => {
            removeChat(id);
          }}
        >
          <IconAction size={'small'} icon={<DeleteOutlined />} />
        </Popconfirm>
      }
    />
  );
});

export default ChatItem;
