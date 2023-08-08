import { FlowEditorProvider } from '@ant-design/pro-flow-editor';
import { DndContext } from '@dnd-kit/core';
import { memo, PropsWithChildren, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';

import { Sidebar } from '@/features/Sidebar';
import { useSettings } from '@/store';
import { useFlowStore } from '@/store/flow';
import { useSession } from 'next-auth/react';
import { Menu } from './Menu';

const FlowLayout = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    useSettings.persist.rehydrate();
    useFlowStore.persist.rehydrate();
    useSettings.setState({ sidebarKey: 'flow' });
  }, []);

  const session = useSession();

  return (
    <DndContext>
      <Flexbox id={'FlowLayout'} horizontal width={'100%'} height={'100%'}>
        <Sidebar />
        <Menu prefixPath="flow" />
        {session?.status === 'loading' ? null : (
          <FlowEditorProvider showDevtools>{children}</FlowEditorProvider>
        )}
      </Flexbox>
    </DndContext>
  );
};

export default memo(FlowLayout);
