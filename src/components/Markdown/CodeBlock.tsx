import Highlighter from '@/components/Highlighter';
import { useSettings } from '@/store/settings';
import { createStyles } from 'antd-style';
import { memo } from 'react';

const useStyles = createStyles(
  ({ css }, size: number) => css`
    :not(:last-child) {
      margin-bottom: ${size}px;
    }
  `,
);

const Code = memo((props: any) => {
  const { fontSize } = useSettings();
  const { styles } = useStyles(fontSize);
  if (!props.children[0]) return null;

  const { children, className } = props.children[0].props;

  if (!children) return null;

  return (
    <Highlighter language={className?.replace('language-', '') || 'markdown'} className={styles}>
      {children instanceof Array ? (children[0] as string) : children}
    </Highlighter>
  );
});
export default Code;
