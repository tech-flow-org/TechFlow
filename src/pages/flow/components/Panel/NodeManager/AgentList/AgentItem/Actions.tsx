import { PlusOutlined } from '@ant-design/icons';
import { FC, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { IconAction } from '@/components/IconAction';
import { useSessionStore } from '@/store';
import { useFlowStore } from '@/store/flow';
import { shallow } from 'zustand/shallow';

interface ActionsProps {
  visible: boolean;
  id: string;
}

const Actions: FC<ActionsProps> = memo(({ visible, id }) => {
  const [createFlowBaseOnAgent] = useFlowStore((s) => [s.createFlowBaseOnAgent], shallow);

  return (
    <Flexbox
      horizontal
      gap={4}
      style={{ display: visible ? undefined : 'none' }}
      // dnd-kit 会监听 onPointerDown，所以子元素需要阻止该事件的冒泡
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
    >
      <IconAction
        size={'small'}
        icon={<PlusOutlined />}
        title={'添加'}
        onClick={() => {
          const agent = useSessionStore.getState().agents[id];
          createFlowBaseOnAgent(agent);
        }}
      />
    </Flexbox>
  );
});

export default Actions;
