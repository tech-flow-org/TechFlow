import { App, ConfigProvider } from 'antd';
import { ThemeProvider, useThemeMode } from 'antd-style';
import 'antd/dist/reset.css';
import Zh_CN from 'antd/locale/zh_CN';
import { PropsWithChildren, useEffect } from 'react';

import { MessageInstance } from 'antd/es/message/interface';
import { NotificationInstance } from 'antd/es/notification/interface';

import { useSessionStore } from '@/store';
import { useSettings } from '@/store/settings';
import { useHighlight } from '@/store/useHighlight';
import { getAntdTheme } from '@/theme/antd';
import { getCustomToken } from '@/theme/customToken';
import { Compressor } from '@/utils/compass';
import { GlobalStyle, NOTIFICATION_PRIMARY, useStyles } from './style';

export let message: MessageInstance;
export let notification: NotificationInstance & { primaryInfo: NotificationInstance['info'] };

const Layout = ({ children }: PropsWithChildren) => {
  const { styles } = useStyles();

  return (
    <ConfigProvider locale={Zh_CN}>
      <App className={styles.bg}>{children}</App>
    </ConfigProvider>
  );
};

export default ({ children }: PropsWithChildren) => {
  const { browserPrefers } = useThemeMode();
  const appearance = useSettings((s) => s.appearance);

  // 初始化全局的 shiki 高亮器
  const { initHighlighter } = useHighlight();

  useEffect(() => {
    initHighlighter();
    Compressor.init();
    // refs: https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#hashydrated
    useSessionStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    useSettings.setState({ appearance: browserPrefers });
  }, [browserPrefers]);

  const { fontSize, contentWidth } = useSettings();

  return (
    <ThemeProvider
      themeMode={'auto'}
      appearance={appearance}
      theme={(appearance) => {
        const defaultValue = getAntdTheme(appearance);
        return {
          ...defaultValue,
          token: { ...defaultValue?.token, fontSize },
        };
      }}
      getStaticInstance={(instances) => {
        message = instances.message;
        notification = {
          ...instances.notification,
          primaryInfo: (props) =>
            instances.notification.info({
              type: 'info',
              placement: 'bottom',
              className: NOTIFICATION_PRIMARY,
              style: { width: 480 },
              ...props,
            }),
        };
      }}
      customToken={(theme) => {
        return {
          ...getCustomToken(theme),
          contentWidth,
          chatContentWidth: contentWidth - 52,
        };
      }}
    >
      <GlobalStyle />
      <Layout>{children}</Layout>
    </ThemeProvider>
  );
};
