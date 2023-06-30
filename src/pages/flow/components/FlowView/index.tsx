import { useDroppable } from '@dnd-kit/core';
import { createStyles } from 'antd-style';
import { CanvasLoading, FlowEditor } from 'kitchen-flow-editor';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { flowSelectors, useFlowStore } from '@/store/flow';
import { FlowNodeRenderType } from '../nodes';
import { useDropNodeOnCanvas } from './useDragAndDrop';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    position: relative;
    grid-area: flow;
  `,
  dragHover: css`
    pointer-events: none;

    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    border: 3px solid ${token.colorPrimary};
  `,
}));

const FlowView = () => {
  const [flow, dispatchFlow] = useFlowStore(
    (s) => [flowSelectors.currentFlowSafe(s), s.dispatchFlow],
    shallow,
  );
  const { styles, cx } = useStyles();

  const [init, setInitEd] = useState(false);
  const flowId = flow?.id;

  const { setNodeRef } = useDroppable({ id: 'agent-flow' });

  const isOver = useDropNodeOnCanvas();

  return (
    <Flexbox ref={setNodeRef} horizontal width={'100%'} className={cx(styles.container)}>
      {isOver && <div className={styles.dragHover} />}
      <>
        {(!flowId || !init) && <CanvasLoading />}
        {flowId && (
          <FlowEditor
            ref={setNodeRef}
            nodeTypes={FlowNodeRenderType}
            flattenNodes={flow.flattenNodes}
            onNodesInit={(editor) => {
              setInitEd(true);
              useFlowStore.setState({ editor });
            }}
            onFlattenNodesChange={(flattenNodes) => {
              dispatchFlow({ type: 'updateFlow', id: flowId, flow: { flattenNodes } });
            }}
            flattenEdges={flow.flattenEdges}
            onFlattenEdgesChange={(flattenEdges) => {
              dispatchFlow({
                type: 'updateFlow',
                id: flowId,
                flow: { flattenEdges },
              });
            }}
            defaultViewport={flow.state.viewport}
            onViewPortChange={(viewport) => {
              dispatchFlow({
                type: 'updateFlowState',
                id: flowId,
                state: { viewport },
                updateDate: false,
              });
            }}
          />
        )}
      </>
    </Flexbox>
  );
};

export default memo(FlowView);
