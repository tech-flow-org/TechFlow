import { DeleteOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Dropdown } from 'antd';
import { FC, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { IconAction } from '@/components/IconAction';
import { useChatStore, useSessionStore } from '@/store';
import Router from 'next/router';
import { shallow } from 'zustand/shallow';

interface ActionsProps {
  visible: boolean;
  id: string;
}

const Actions: FC<ActionsProps> = memo(({ visible, id }) => {
  const { modal } = App.useApp();

  const [removeAgent] = useSessionStore((s) => [s.removeAgent], shallow);

  const [updateAgentContent] = useChatStore((s) => [s.updateAgentContent], shallow);

  return (
    <Flexbox
      horizontal
      gap={4}
      style={{ display: visible ? undefined : 'none' }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <IconAction
        title={'基于该角色创建新会话'}
        size={'small'}
        icon={<PlusOutlined />}
        onClick={async () => {
          const content = useSessionStore.getState().agents[id]?.content;
          updateAgentContent(content);
          Router.push('/');
        }}
      />
      {id === 'default' ? null : (
        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              // {
              //   icon: <InboxOutlined />,
              //   key: 'archive',
              //   label: '归档',
              //   onClick: () => {},
              // },
              {
                icon: <DeleteOutlined />,
                label: '删除角色',
                key: 'delete',
                danger: true,
                onClick: () => {
                  modal.confirm({
                    type: 'warning',
                    title: '确认删除角色吗？',
                    content: '删除该角色的同时和该角色的会话断开关联',
                    centered: true,
                    okButtonProps: { danger: true },
                    okText: '删除角色',
                    cancelText: '我再想想',
                    onOk: () => {
                      removeAgent(id);

                      Router.push('/agent/default');
                    },
                  });
                },
              },
            ].filter(Boolean),
          }}
        >
          <IconAction size={'small'} icon={<MoreOutlined />} />
        </Dropdown>
      )}
    </Flexbox>
  );
});

export default Actions;
