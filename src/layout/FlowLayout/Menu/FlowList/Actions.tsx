import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { App, Dropdown } from 'antd';
import { FC, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { IconAction } from '@/components/IconAction';
import { useFlowStore } from '@/store/flow';
import { shallow } from 'zustand/shallow';

interface ActionsProps {
  visible: boolean;
  id: string;
}

const Actions: FC<ActionsProps> = memo(({ visible, id }) => {
  const { modal } = App.useApp();

  const [removeFlow] = useFlowStore((s) => [s.removeFlow], shallow);

  return (
    <Flexbox horizontal gap={4} style={{ display: visible ? undefined : 'none' }}>
      {id === 'default' ? null : (
        <>
          <IconAction size={'small'} icon={<EditOutlined />} />

          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  icon: <DeleteOutlined />,
                  label: '删除任务流',
                  key: 'delete',
                  danger: true,
                  onClick: () => {
                    modal.confirm({
                      type: 'warning',
                      title: '确认删除任务流？',
                      content: '删除该角色的同时和该角色的会话断开关联',
                      centered: true,
                      okButtonProps: { danger: true },
                      okText: '删除',
                      cancelText: '我再想想',
                      onOk: () => {
                        removeFlow(id);
                      },
                    });
                  },
                },
              ].filter(Boolean),
            }}
          >
            <IconAction size={'small'} icon={<MoreOutlined />} />
          </Dropdown>
        </>
      )}
    </Flexbox>
  );
});

export default Actions;
