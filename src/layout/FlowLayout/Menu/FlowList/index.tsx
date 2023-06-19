import { Empty } from 'antd';
import isEqual from 'fast-deep-equal';
import Link from 'next/link';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { flowSelectors, useFlowStore } from '@/store/flow';
import FlowItem from './FlowItem';

const FlowList = memo(() => {
  const [activeId, isEmpty, loading] = useFlowStore(
    (s) => [s.activeId, flowSelectors.flowMetaList(s).length === 0, s.loading],
    shallow,
  );
  const list = useFlowStore(flowSelectors.flowMetaList, isEqual);

  return isEmpty ? (
    <Empty
      style={{ marginTop: '40vh' }}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={'列表空空如也...'}
    />
  ) : (
    <>
      {list.map(({ id }) => (
        <Flexbox key={id} gap={4} paddingBlock={4}>
          <Link href={`/flow/${id}`}>
            <FlowItem
              active={activeId === id}
              key={id}
              id={id}
              loading={loading && id === activeId}
            />
          </Link>
        </Flexbox>
      ))}
    </>
  );
});

export default FlowList;
