import CardListItem from '@/components/CardListItem';
import { useDndMonitor } from '@dnd-kit/core';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import AgentAvatar from '@/components/AgentAvatar';
import { Draggable, DragOverlay } from '@/components/DndKit';
import { useTheme } from 'antd-style';
import { symbolNodeList, SymbolNodeMasterTypes } from '../../../nodes';

const SymbolList = () => {
  const theme = useTheme();
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      if (event.active.data.current?.source !== 'symbol') return;

      setDraggingId(event.active.id as string);
    },
    onDragEnd: () => {
      setDraggingId(null);
    },
  });

  const SymbolMaster = SymbolNodeMasterTypes[draggingId as keyof typeof SymbolNodeMasterTypes];
  return (
    <Flexbox gap={4}>
      {symbolNodeList.map((i) => (
        <Draggable
          id={i.id}
          dragging={draggingId === i.id}
          key={i.id}
          data={{ type: i.id, source: 'symbol' }}
        >
          <CardListItem
            active={false}
            title={i.title}
            avatar={<AgentAvatar avatar={i.avatar} size={32} shape={'square'} />}
            description={i.description}
            style={{ color: theme.colorText }}
          />
        </Draggable>
      ))}
      {draggingId && SymbolMaster ? (
        <DragOverlay>
          <SymbolMaster id={'id'} />
        </DragOverlay>
      ) : null}
    </Flexbox>
  );
};

export default SymbolList;
