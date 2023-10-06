import { useDndMonitor } from '@dnd-kit/core';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import AgentAvatar from '@/components/AgentAvatar';
import CardListItem from '@/components/CardListItem';
import { Draggable, DragOverlay } from '@/components/DndKit';
import { Typography } from 'antd';
import { useTheme } from 'antd-style';
import { SYMBOL_NODE_LIST, SymbolNodeMasterTypes } from '../../../nodes';

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

  const groupList = SYMBOL_NODE_LIST.reduce((pre, current) => {
    const group = current.group || '默认节点';
    if (!pre[group]) {
      pre[group] = [];
    }
    pre[group].push(current);
    return pre;
  }, {} as Record<string, typeof SYMBOL_NODE_LIST>);

  return (
    <Flexbox gap={4}>
      {Object.keys(groupList).map((key) => {
        const list = groupList[key]?.map((i) => {
          return (
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
          );
        });
        return (
          <>
            <Typography.Text type={'secondary'} style={{ fontSize: 12, marginLeft: 8 }}>
              {key}
            </Typography.Text>
            {list}
          </>
        );
      })}
      {draggingId && SymbolMaster ? (
        <DragOverlay>
          <SymbolMaster id={draggingId} />
        </DragOverlay>
      ) : null}
    </Flexbox>
  );
};

export default SymbolList;
