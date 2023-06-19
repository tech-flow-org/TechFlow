import { useDndMonitor } from '@dnd-kit/core';
import { useTheme } from 'antd-style';
import { FlowBasicNode } from 'kitchen-flow-editor';
import { PointerEvent, useState } from 'react';
import { useReactFlow } from 'reactflow';
import { v4 as uuid } from 'uuid';

import { createNode } from '@/helpers/flow';
import { symbolNodeList } from '../nodes';

export const useDropNodeOnCanvas = () => {
  const instance = useReactFlow();

  const [isOver, setOver] = useState(false);
  const theme = useTheme();

  useDndMonitor({
    onDragMove({ over, activatorEvent, delta }) {
      const event = activatorEvent as unknown as PointerEvent;
      setOver((event.clientX + delta.x || 0) > (over?.rect.left || 0));
    },
    onDragCancel() {
      setOver(false);
    },
    onDragEnd({ over, activatorEvent, active, delta }) {
      if (!over) return;
      const event = activatorEvent as unknown as PointerEvent;

      const left = event.clientX + delta.x - over.rect.left;
      const top = event.clientY + delta.y - over.rect.top;

      const zoom = instance.getZoom();
      const position = instance.project({
        // 让 x 位置在节点中间
        x: left - (theme.aiTaskNodeWidth / 2) * zoom,
        // 在 drag 部分对应为 40
        y: top - 80 * zoom,
      });

      const id = uuid();
      // 基于 type 查找对应的 Symbol 类型
      const symbolNode = symbolNodeList.find((item) => item.id === active.data.current?.type);

      if (symbolNode) {
        const node: FlowBasicNode = symbolNode.onCreateNode
          ? //   如果有定义 onCreateNode ，则使用 onCreateNode 创建节点
            symbolNode.onCreateNode(
              { id, position, type: symbolNode.id },
              active.data.current as any,
            )
          : // 否则使用默认的创建节点方法
            createNode({ id, position, type: symbolNode.id }, symbolNode.defaultContent, {
              title: symbolNode.title,
              description: symbolNode.description,
              avatar: symbolNode.avatar,
            });

        instance.addNodes(node);
      }

      setOver(false);
    },
  });

  return isOver;
};
