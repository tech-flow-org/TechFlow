import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, prefixCls }) => ({
  actions: css`
    height: 40px;
    border: 1px solid ${token.colorBorder} !important;
    box-shadow: none;
  `,
  upload: css`
    width: 100%;
    .${prefixCls}-upload {
      width: 100%;
    }
  `,
}));
