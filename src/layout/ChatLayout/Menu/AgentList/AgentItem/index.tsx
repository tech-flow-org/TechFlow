import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { FC, memo, useState } from 'react';
import { shallow } from 'zustand/shallow';

import AgentAvatar from '@/components/AgentAvatar';
import CardListItem from '@/components/CardListItem';

import Actions from './Actions';

import { useSessionStore } from '@/store';

const useStyles = createStyles(({ css }) => {
  return {
    time: css`
      align-self: flex-start;
    `,
  };
});

interface AgentItemProps {
  active: boolean;
  id: string;
  loading: boolean;
  simple?: boolean;
}

const AgentItem: FC<AgentItemProps> = memo(({ id, active, simple = true, loading }) => {
  const { styles, theme } = useStyles();
  const {
    title,
    content: systemRole,
    avatar,
    avatarBackground,
    updateAt,
  } = useSessionStore((s) => s.agents[id] || {}, isEqual);
  const [switchAgent] = useSessionStore((s) => [s.switchAgent], shallow);
  const [isHover, setHovered] = useState(false);

  const displayTitle = title || systemRole || '默认角色';

  const showAction = isHover || active;
  return (
    <CardListItem
      loading={loading}
      title={displayTitle}
      description={simple ? undefined : systemRole}
      active={active}
      date={updateAt}
      classNames={{ time: styles.time }}
      avatar={
        <AgentAvatar
          avatar={avatar}
          size={simple ? 20 : 32}
          shape="square"
          title={displayTitle}
          background={avatarBackground}
        />
      }
      onClick={() => {
        switchAgent(id);
      }}
      onHoverChange={(hover) => {
        setHovered(hover);
      }}
      showAction={showAction}
      renderActions={<Actions visible={showAction} id={id} />}
      style={{
        height: simple ? 40 : undefined,
        color: theme.colorText,
        alignItems: 'center',
      }}
    />
  );
});

export default AgentItem;
