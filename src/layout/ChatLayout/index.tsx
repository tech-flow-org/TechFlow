import { Sidebar } from '@/features/Sidebar';
import { useSettings } from '@/store/settings';
import { useStylish } from '@/theme/customStylish';
import { createStyles, useResponsive } from 'antd-style';
import { ReactNode, memo, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';
import { Sessions } from 'src/layout/ChatLayout/Menu';

export const useStyles = createStyles(({ css, token }) => ({
  grid: css`
    display: grid;
    grid-template-areas: 'sidebar session main';
    grid-template-columns: ${token.sidebarWidth}px var(--session-width) 1fr;
    grid-template-rows: 100vh;

    width: 100%;
  `,
}));

interface ChatLayoutProps {
  children: ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  const { mobile } = useResponsive();
  const stylish = useStylish();
  const { styles } = useStyles();
  const sessionsWidth = useSettings((s) => s.sessionsWidth);

  useEffect(() => {
    useSettings.persist.rehydrate();
    useSettings.setState({ sidebarKey: 'chat' });
  }, []);

  const ChatContent = (
    <Flexbox flex={1} gap={24} className={stylish.layoutContent}>
      {children}
    </Flexbox>
  );
  return mobile ? (
    ChatContent
  ) : (
    <Flexbox
      id={'ChatLayout'}
      className={styles.grid}
      style={{ '--session-width': `${sessionsWidth}px` } as any}
    >
      <Sidebar />

      <Flexbox style={{ gridArea: 'session' }}>
        <Sessions />
      </Flexbox>

      <Flexbox flex={1} align={'center'} style={{ gridArea: 'main', overflowY: 'scroll' }}>
        {ChatContent}
      </Flexbox>
    </Flexbox>
  );
};

export default memo(ChatLayout);
