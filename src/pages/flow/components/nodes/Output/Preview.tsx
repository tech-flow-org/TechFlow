import { memo } from 'react';

import { BasicNode, NodeField } from 'kitchen-flow-editor';

const OutputNode = memo(() => {
  return (
    <BasicNode.Preview title={'结果输出'}>
      <NodeField title={'变量名'} id={'variable'}>
        变量名
      </NodeField>
      <NodeField title={'输出来源'} id={'sourceId'}>
        来源
      </NodeField>
    </BasicNode.Preview>
  );
});

export default OutputNode;
