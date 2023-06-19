import { Typography } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { AgentList } from './AgentList';
import SymbolList from './SymbolList';

const NodeManager = memo(() => {
  return (
    <Flexbox height={'100%'} gap={8} style={{ overflowY: 'scroll' }}>
      <div>
        <Typography.Text type={'secondary'} style={{ fontSize: 12, marginLeft: 8 }}>
          默认节点
        </Typography.Text>
        <SymbolList />
      </div>
      <div>
        <Typography.Text type={'secondary'} style={{ fontSize: 12, marginLeft: 8 }}>
          角色
        </Typography.Text>
        <AgentList />
      </div>
    </Flexbox>
  );
});

export default NodeManager;
