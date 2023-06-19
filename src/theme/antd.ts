import { GlobalToken, theme } from 'antd';
import { GetAntdTheme } from 'antd-style';

export const getAntdTheme: GetAntdTheme = (appearance) => {
  const common: Partial<GlobalToken> = {
    fontSize: 16,
    controlOutline: 'transparent',
    motion: false,
  };

  return appearance === 'dark'
    ? {
        algorithm: [theme.darkAlgorithm],
        token: {
          ...common,
          colorBgLayout: 'hsl(240,11%,15%)',
          colorBgContainer: 'hsl(229,10%,22%)',
          colorBgElevated: 'hsl(224,11%,27%)',
        },
        components: {
          Segmented: {
            colorBgLayout: 'hsl(240,11%,12%)',
          },
        },
      }
    : {
        token: {
          ...common,
        },
        components: {
          Segmented: {
            colorBgLayout: '#f1f1f1',
          },
        },
      };
};
