import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { useFlowStore } from '@/store/flow';

export const useStyles = createStyles(({ css }) => ({
  top: css`
    position: sticky;
    top: 0;
  `,
}));

const Header = memo(() => {
  const { styles } = useStyles();

  const [keywords, createFlow] = useFlowStore((s) => [s.keywords, s.createFlow], shallow);

  return (
    <Flexbox gap={16} padding={'16px 8px 0'} className={styles.top}>
      <Flexbox horizontal gap={8}>
        <Input
          prefix={<SearchOutlined />}
          allowClear
          value={keywords}
          placeholder="搜索"
          style={{ borderColor: 'transparent' }}
          onChange={(e) => useFlowStore.setState({ keywords: e.target.value })}
        />
        <Tooltip arrow={false} title={'新的任务流'} placement={'right'}>
          <Button icon={<PlusOutlined />} style={{ minWidth: 32 }} onClick={createFlow} />
        </Tooltip>
      </Flexbox>
    </Flexbox>
  );
});

export default Header;
