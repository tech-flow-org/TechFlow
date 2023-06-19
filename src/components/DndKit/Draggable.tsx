import { useDraggable } from '@dnd-kit/core';
import { createStyles } from 'antd-style';
import { ReactNode } from 'react';

const useStyles = createStyles(({ css }) => ({
  dragging: css`
    opacity: 0.5;
  `,
}));

interface DraggableProps {
  id: string;
  children: ReactNode;
  dragging: boolean;
  data?: any;
}

export const Draggable = ({ id, children, dragging, data }: DraggableProps) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id, data });
  const { styles, cx } = useStyles();

  return (
    <li ref={setNodeRef} className={cx(dragging && styles.dragging)} {...listeners} {...attributes}>
      {children}
    </li>
  );
};
