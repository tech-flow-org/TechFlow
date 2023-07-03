import { createStyles } from 'antd-style';

export const NOTIFICATION_PRIMARY = 'notification-primary-info';

export const useStyles = createStyles(({ css, token }) => ({
  code: css`
    font-family: ${token.fontFamilyCode};
    background: ${token.colorFillQuaternary};
    text-wrap: balance;
    padding: 8px;
  `,
}));
