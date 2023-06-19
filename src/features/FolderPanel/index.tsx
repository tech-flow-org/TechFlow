import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { PropsWithChildren, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { DraggablePanel } from '@/components/DraggablePanel';
import { useSettings } from '@/store';

export const useStyles = createStyles(({ css, token }) => ({
  panel: css`
    height: 100vh;
    color: ${token.colorTextSecondary};
  `,
}));

export default ({ children }: PropsWithChildren) => {
  const { styles } = useStyles();
  const [sessionsWidth, sessionExpandable] = useSettings(
    (s) => [s.sessionsWidth, s.sessionExpandable],
    shallow,
  );
  const [tmpWidth, setWidth] = useState(sessionsWidth);
  if (tmpWidth !== sessionsWidth) setWidth(sessionsWidth);

  return (
    <DraggablePanel
      placement="left"
      maxWidth={400}
      defaultSize={{ width: tmpWidth }}
      size={{ width: sessionsWidth, height: '100vh' }}
      onSizeChange={(_, size) => {
        if (!size) return;

        const nextWidth = typeof size.width === 'string' ? parseInt(size.width) : size.width;

        if (isEqual(nextWidth, sessionsWidth)) return;

        setWidth(nextWidth);
        useSettings.setState({ sessionsWidth: nextWidth });
      }}
      isExpand={sessionExpandable}
      onExpandChange={(expand) => {
        useSettings.setState({
          sessionsWidth: expand ? tmpWidth : 0,
          sessionExpandable: expand,
        });
      }}
      className={styles.panel}
    >
      {children}
    </DraggablePanel>
  );
};
