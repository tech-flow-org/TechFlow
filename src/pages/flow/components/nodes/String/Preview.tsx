import { Input } from 'antd';
import { memo } from 'react';

import { BasicNode } from 'kitchen-flow-editor';

const String = memo(() => {
  return (
    <BasicNode.Preview title={'文本框'}>
      <Input.TextArea placeholder={'在这里输入文本内容'} />
    </BasicNode.Preview>
  );
});

export default String;
