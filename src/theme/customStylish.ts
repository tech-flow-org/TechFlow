import { createStylish } from 'antd-style';

interface ChatStylish {
  layoutContent: string;
}
declare module 'antd-style' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface CustomStylish extends ChatStylish {}
}

export const useStylish = createStylish(({ css, responsive, token }) => {
  return {
    layoutContent: css`
      width: ${token.contentWidth}px;
      margin-bottom: 24px;

      ${responsive.mobile} {
        width: 100%;
        padding-inline: 12px;
      }
    `,
  };
});

// export const getCustomStylish: GetCustomStylish<ChatStylish> = ({ token, css, responsive }) => {
//   return {
//     layoutContent: css`
//       margin-bottom: 24px;
//       width: ${token.contentWidth}px;
//       height: 100%;
//
//       ${responsive.mobile} {
//         width: 100%;
//         padding-inline: 12px;
//       }
//     `,
//   };
// };
