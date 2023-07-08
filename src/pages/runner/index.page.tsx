import { useSettings } from '@/store';
import type { NextPage } from 'next';
import { memo, useEffect } from 'react';
import RunnerLayout from './layout';

const Runner: NextPage = () => {
  useEffect(() => {
    useSettings.setState({ sidebarKey: 'runner' });
  }, []);

  return (
    <RunnerLayout>
      <div />
    </RunnerLayout>
  );
};

export default memo(Runner);
