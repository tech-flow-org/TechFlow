import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import { FC } from 'react';
import { Flexbox } from 'react-layout-kit';
import { LogoImage } from './Logo';

const { Title } = Typography;

const useStyles = createStyles(({ css, token }) => ({
  demo: css`
    color: ${token.colorText};
  `,
}));

const Logo: FC = () => {
  const { styles } = useStyles();

  return (
    <Flexbox gap={8} horizontal align={'center'}>
      <LogoImage />
      <Flexbox gap={4}>
        <Title style={{ fontWeight: 'bold', lineHeight: 1, marginBottom: 0 }} level={4}>
          <span className={styles.demo}>TechFLow</span>
        </Title>
      </Flexbox>
    </Flexbox>
  );
};

export default Logo;
