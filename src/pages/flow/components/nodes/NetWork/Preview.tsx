import { memo } from 'react';

import { BasicNode, NodeField } from 'kitchen-flow-editor';

const OutputNode = memo(() => {
  return (
    <BasicNode.Preview title={'结果输出'}>
      <NodeField title={'网络地址'} id={'variable'}>
        网络地址
      </NodeField>
      <NodeField title={'参数'} id={'sourceId'}>
        参数
      </NodeField>
    </BasicNode.Preview>
  );
});

export default OutputNode;
