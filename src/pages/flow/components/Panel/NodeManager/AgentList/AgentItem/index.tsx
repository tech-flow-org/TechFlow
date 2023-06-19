import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { FC, memo, useState } from 'react';

import AgentAvatar from '@/components/AgentAvatar';
import CardListItem from '@/components/CardListItem';

import { getSafeAgent } from '@/helpers/agent';
import { useSessionStore } from '@/store';
import Actions from './Actions';

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
  } = useSessionStore((s) => getSafeAgent(s.agents, id), isEqual);

  const [isHover, setHovered] = useState(false);

  const displayTitle = title || systemRole || '默认角色';

  return (
    <CardListItem
      loading={loading}
      title={displayTitle}
      description={simple ? undefined : systemRole}
      active={active}
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
      onHoverChange={(hover) => {
        setHovered(hover);
      }}
      showAction={isHover}
      style={{
        height: simple ? 40 : undefined,
        color: theme.colorText,
        alignItems: 'center',
      }}
      renderActions={<Actions visible={isHover} id={id} />}
    />
  );
});

export default AgentItem;
