import { Loading3QuartersOutlined as Loading } from '@ant-design/icons';
import { memo } from 'react';
import { Center } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { useHighlight } from '@/store/useHighlight';

import { useSettings } from '@/store/settings';
import { Prism } from './Prism';

import { createStyles } from 'antd-style';
import type { HighlighterProps } from './index';

const useStyles = createStyles(({ css, token, cx, prefixCls }) => {
  const prefix = `${prefixCls}-highlighter`;

  return {
    shiki: cx(
      `${prefix}-shiki`,
      css`
        .shiki {
          overflow-x: scroll;

          .line {
            font-family: 'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
          }
        }
      `,
    ),
    prism: css`
      pre {
        overflow-x: scroll;
      }
    `,

    loading: css`
      position: absolute;
      top: 8px;
      right: 12px;
      color: ${token.colorTextTertiary};
    `,
  };
});

type SyntaxHighlighterProps = Pick<HighlighterProps, 'language' | 'children'>;

const SyntaxHighlighter = memo<SyntaxHighlighterProps>(({ children, language }) => {
  const { styles, theme } = useStyles();
  const appearance = useSettings((s) => s.appearance);
  const isDarkMode = appearance === 'dark';

  const [codeToHtml, isLoading] = useHighlight((s) => [s.codeToHtml, !s.highlighter], shallow);

  return (
    <>
      {isLoading ? (
        <div className={styles.prism}>
          <Prism language={language} isDarkMode={isDarkMode}>
            {children}
          </Prism>
        </div>
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: codeToHtml(children, language, isDarkMode) || '',
          }}
          className={styles.shiki}
        />
      )}

      {isLoading && (
        <Center horizontal gap={8} className={styles.loading}>
          <Loading spin style={{ color: theme.colorTextTertiary }} />
          shiki 着色器准备中...
        </Center>
      )}
    </>
  );
});

export default SyntaxHighlighter;
