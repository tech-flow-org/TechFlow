import { Avatar, AvatarProps } from 'antd';
import { createStyles } from 'antd-style';
import { FC } from 'react';
import { Center } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    cursor: pointer;

    > * {
      cursor: pointer;
    }
  `,
  emoji: css`
    border: 1px solid ${token.colorBorder};
  `,
}));

interface AgentAvatarProps {
  avatar?: string;
  title?: string;
  size?: number;
  shape?: AvatarProps['shape'];
  background?: string;
}

const AgentAvatar: FC<AgentAvatarProps> = ({
  avatar,
  title,
  size = 40,
  shape = 'circle',
  background,
}) => {
  const { styles, theme } = useStyles();

  const backgroundColor = background ?? theme.colorBgContainer;

  const isImage = avatar && ['/', 'http', 'data:'].some((i) => avatar.startsWith(i));

  return (
    <Center
      style={{
        width: size,
        height: size,
        borderRadius: shape === 'circle' ? '50%' : 6,
        backgroundColor,
        borderWidth: isImage ? 1 : 0,
      }}
      className={styles.container}
    >
      {!avatar ? (
        <Avatar shape={shape} size={size}>
          {title?.slice(0, 2)}
        </Avatar>
      ) : isImage ? (
        <Avatar shape={shape} size={size} src={avatar} />
      ) : (
        <Center
          className={styles.emoji}
          style={{
            width: size,
            height: size,
            fontSize: size / 2,
            borderRadius: shape === 'circle' ? '50%' : 6,
            backgroundColor,
          }}
        >
          {avatar}
        </Center>
      )}
    </Center>
  );
};

export default AgentAvatar;
