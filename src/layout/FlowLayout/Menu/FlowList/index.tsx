import { Empty } from 'antd';
import isEqual from 'fast-deep-equal';
import Link from 'next/link';
import { memo, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { flowSelectors, useFlowStore } from '@/store/flow';
import { useSession } from 'next-auth/react';
import FlowItem from './FlowItem';

const FlowList: React.FC<{
  prefixPath: string;
}> = memo((props) => {
  const [activeId, isEmpty, loading, queryFlowListForServer, setLoading] = useFlowStore(
    (s) => [
      s.activeId,
      flowSelectors.flowMetaList(s).length === 0,
      s.loading,
      s.queryFlowListForServer,
      (loading: boolean) => {
        s.loading = loading;
      },
    ],
    shallow,
  );

  const session = useSession();

  useEffect(() => {
    if (session.status.toLowerCase() === 'authenticated') {
      setLoading(true);
      queryFlowListForServer().finally(() => setLoading(false));
    }
  }, [session.status.toLowerCase()]);

  const list = useFlowStore(flowSelectors.flowMetaList, isEqual);

  const { prefixPath = '/flow' } = props;

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
          <Link href={`/${prefixPath}/${id}`}>
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
