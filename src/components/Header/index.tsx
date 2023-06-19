import { IconAction } from '@/components/IconAction';
import { useSettings } from '@/store/settings';
import { ShareAltOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import { createStyles, useResponsive } from 'antd-style';
import Link from 'next/link';
import { CSSProperties, FC, ReactNode } from 'react';
import { Flexbox } from 'react-layout-kit';
import Logo from '../Logo';
import { Moon, Sun } from './ThemeIcon';

const useStyles = createStyles(({ css, token }) => ({
  header: css`
    height: 56px;
  `,
  demo: css`
    color: ${token.colorText};
  `,
}));

interface HeaderProps {
  style?: CSSProperties;
  shareable?: boolean;
  onShare?: () => string;
  content?: ReactNode;
}

const Header: FC<HeaderProps> = ({ style, content, shareable, onShare }) => {
  const appearance = useSettings((s) => s.appearance);
  const { mobile } = useResponsive();
  const { styles } = useStyles();

  return (
    <ConfigProvider theme={{ token: { fontSize: 16 } }}>
      <Flexbox width={'100%'} gap={16} padding={'12px 0'} className={styles.header} style={style}>
        <Flexbox align={'center'} horizontal distribution={'space-between'}>
          <Link href={'/'}>
            <Logo />
          </Link>
          <Flexbox horizontal>{content}</Flexbox>
          <Flexbox horizontal gap={4}>
            {shareable && (
              <IconAction
                title={'分享'}
                icon={<ShareAltOutlined />}
                onClick={() => {
                  if (!onShare) return;

                  window.open(onShare());
                }}
              />
            )}
            {mobile ? (
              <IconAction
                icon={appearance === 'dark' ? <Moon /> : <Sun />}
                onClick={() => {
                  useSettings.setState({ appearance: appearance === 'dark' ? 'light' : 'dark' });
                }}
              />
            ) : null}
          </Flexbox>
        </Flexbox>
      </Flexbox>
    </ConfigProvider>
  );
};

export default Header;
