import { Modifier, DragOverlay as Overlay } from '@dnd-kit/core';
import { createStyles } from 'antd-style';
import { MouseEvent, PropsWithChildren, memo } from 'react';
import { createPortal } from 'react-dom';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    cursor: grabbing;
    width: ${token.aiTaskNodeWidth}px;
    background: ${token.colorBgElevated};
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.2) 0 40px 40px -7px;
  `,
}));

// 可以用于控制 Overlay 的位置和尺寸
const adjustTranslate: Modifier = ({
  transform,
  containerNodeRect,
  activeNodeRect,
  activatorEvent,
}) => {
  const scale = 0.6;
  const clickOffsetX = (activatorEvent as any as MouseEvent)?.clientX - (activeNodeRect?.left || 0);

  return {
    ...transform,
    x: transform.x + (clickOffsetX || 0) * 0.4 - (containerNodeRect?.width || 0) / 2,
    // 在 drop 部分对应为 80
    y: transform.y - 40,

    scaleX: scale,
    scaleY: scale,
  };
};
export const DragOverlay = memo(({ children }: PropsWithChildren) => {
  const { styles } = useStyles();
  return createPortal(
    <Overlay adjustScale modifiers={[adjustTranslate]}>
      <div className={styles.container}>{children}</div>
    </Overlay>,
    document.body,
  );
});
