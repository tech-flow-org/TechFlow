import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { FC, memo, useState } from 'react';

import AgentAvatar from '@/components/AgentAvatar';
import CardListItem from '@/components/CardListItem';

import { IconAction } from '@/components/IconAction';
import { getSafeFlowMeta } from '@/helpers/flow';
import { useFlowStore } from '@/store/flow';
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';

const useStyles = createStyles(({ css }) => {
  return {
    time: css`
      align-self: flex-start;
    `,
  };
});

interface FlowItemProps {
  active: boolean;
  id: string;
  loading?: boolean;
}

const FlowItem: FC<FlowItemProps> = memo(({ id, active, loading }) => {
  const { styles, theme } = useStyles();
  const { title, description, avatar, avatarBackground, updateAt } = useFlowStore(
    (s) => getSafeFlowMeta(s.flows, id),
    isEqual,
  );

  const removeFlow = useFlowStore((s) => s.removeFlow);

  const [isHover, setHovered] = useState(false);

  const displayTitle = title || description || '默认角色';

  const showAction = isHover || active;
  return (
    <CardListItem
      loading={loading}
      title={displayTitle}
      description={description}
      active={active}
      date={updateAt}
      classNames={{ time: styles.time }}
      avatar={
        <AgentAvatar
          avatar={avatar}
          size={32}
          shape="square"
          title={displayTitle}
          background={avatarBackground}
        />
      }
      onHoverChange={(hover) => {
        setHovered(hover);
      }}
      showAction={showAction}
      renderActions={
        <Popconfirm
          title={'确认要删除这个任务流吗？'}
          okButtonProps={{ danger: true }}
          okText={'删除'}
          onConfirm={() => {
            removeFlow(id);
          }}
        >
          <IconAction
            size={'small'}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      }
      style={{
        color: theme.colorText,
        alignItems: 'center',
      }}
    />
  );
});

export default FlowItem;
