import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ css, token }) => ({
  sidebar: css`
    grid-area: sidebar;

    width: ${token.sidebarWidth}px;
    min-width: ${token.sidebarWidth}px;
    padding: 16px 0;

    background: ${token.colorBgLayoutSecondary};
    border-right: 1px solid ${rgba(token.colorBorderDivider, 0.2)};
  `,
  user: css`
    cursor: pointer;
    background: linear-gradient(to right, ${token.green3}, ${token.gold3});
  `,
}));
