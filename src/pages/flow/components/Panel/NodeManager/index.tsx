import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import SymbolList from './SymbolList';

const NodeManager = memo(() => {
  return (
    <Flexbox height={'100%'} gap={8} style={{ overflowY: 'scroll' }}>
      <div>
        <SymbolList />
      </div>
    </Flexbox>
  );
});

export default NodeManager;
