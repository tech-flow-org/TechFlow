import { useDndMonitor } from '@dnd-kit/core';
import { Empty } from 'antd';
import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { rgba } from 'polished';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { Draggable, DragOverlay } from '@/components/DndKit';
import { agentSelectors, useSessionStore } from '@/store/session';

import { AITaskSymbol } from '@/pages/flow/components/nodes/AITask';
import AgentItem from './AgentItem';

export const useStyles = createStyles(({ css, token }) => ({
  button: css`
    position: sticky;
    z-index: 30;
    bottom: 0;

    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;

    margin-top: 8px;
    padding: 12px 12px;

    background: ${rgba(token.colorBgLayout, 0.5)};
    backdrop-filter: blur(8px);
  `,
}));

export const AgentList = memo(() => {
  const [activeId, loading, isEmpty] = useSessionStore(
    (s) => [s.activeId, s.addingAgentName, agentSelectors.agentList(s).length === 0],
    shallow,
  );
  const list = useSessionStore(agentSelectors.agentList, isEqual);

  const [draggingId, setDraggingId] = useState<string | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      if (event.active.data.current?.source !== 'agent') return;
      setDraggingId(event.active.id as string);
    },
    onDragEnd: () => {
      setDraggingId(null);
    },
  });

  return isEmpty ? (
    <Empty
      style={{ marginTop: '40vh' }}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={'列表空空如也...'}
    />
  ) : (
    <>
      {list.map(({ id, ...data }) => (
        <Draggable
          dragging={draggingId === id}
          data={{ ...data, source: 'agent', type: 'aiTask' }}
          key={id}
          id={id}
        >
          <Flexbox gap={4} paddingBlock={4}>
            <AgentItem
              active={activeId === id}
              key={id}
              id={id}
              simple={false}
              loading={loading && id === activeId}
            />
          </Flexbox>
        </Draggable>
      ))}

      {draggingId && (
        <DragOverlay>
          <AITaskSymbol.preview id={draggingId} />
        </DragOverlay>
      )}
    </>
  );
});
