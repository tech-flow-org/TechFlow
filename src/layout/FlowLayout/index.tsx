import { DndContext } from '@dnd-kit/core';
import { FlowEditorProvider } from 'kitchen-flow-editor';
import { memo, PropsWithChildren, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';

import { Sidebar } from '@/features/Sidebar';
import { useSettings } from '@/store';
import { useFlowStore } from '@/store/flow';
import { Menu } from './Menu';

const FlowLayout = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    useSettings.persist.rehydrate();
    useFlowStore.persist.rehydrate();
    useSettings.setState({ sidebarKey: 'flow' });
  }, []);

  return (
    <DndContext>
      <Flexbox id={'FlowLayout'} horizontal width={'100%'} height={'100%'}>
        <Sidebar />
        <Menu />
        <FlowEditorProvider showDevtools>{children}</FlowEditorProvider>
      </Flexbox>
    </DndContext>
  );
};

export default memo(FlowLayout);
