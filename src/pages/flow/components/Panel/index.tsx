import { DraggablePanel } from '@/components/DraggablePanel';

import { SearchBar } from '@/components/SearchBar';
import { useFlowStore } from '@/store/flow';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';
import NodeManager from './NodeManager';

export default () => {
  const [showNodeManager, keywords] = useFlowStore(
    (s) => [s.showNodeManager, s.nodeManagerKeywords],
    shallow,
  );

  return (
    <DraggablePanel
      isExpand={showNodeManager}
      onExpandChange={(expand) => {
        useFlowStore.setState({ showNodeManager: expand });
      }}
      placement={'right'}
      maxWidth={400}
      size={{ height: '100%' }}
      style={{
        paddingInline: 4,
        gridArea: 'panel',
      }}
    >
      <Flexbox gap={8} height={'100%'}>
        <Flexbox horizontal>
          <SearchBar
            value={keywords}
            style={{ marginInline: 8, marginTop: 8, position: 'sticky' }}
            onChange={(e) => {
              useFlowStore.setState({ nodeManagerKeywords: e.target.value });
            }}
          />
        </Flexbox>
        <NodeManager />
      </Flexbox>
    </DraggablePanel>
  );
};
