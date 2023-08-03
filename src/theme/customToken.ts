import { GetCustomToken } from 'antd-style';

interface ChatToken {
  contentWidth: number;
  sidebarWidth: number;
  chatContentWidth: number;
  colorBorderDivider: string;
  colorBgLayoutSecondary: string;
  aiTaskNodeWidth: number;
}
declare module 'antd-style' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface CustomToken extends ChatToken {}
}

export const getCustomToken: GetCustomToken<ChatToken> = ({ isDarkMode, token }) => {
  return {
    contentWidth: 400,
    sidebarWidth: 56,
    chatContentWidth: 748,
    colorBorderDivider: isDarkMode ? '#000' : token.colorBorder,
    colorBgLayoutSecondary: isDarkMode ? 'hsl(240,11%,12%)' : '#f1f1f1',
    aiTaskNodeWidth: 480,
  };
};
