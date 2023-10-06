import { BasicNode } from '@ant-design/pro-flow-editor';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { InputSchemaRender } from '../InputSchemaRender';
import { SYMBOL_NODE_LIST } from '../nodes';

const DefaultPreview = memo<{ id: string }>(({ id }) => {
  const nodeConfig = SYMBOL_NODE_LIST.find((item) => item.id === id);

  return (
    <BasicNode.Preview title={nodeConfig?.title}>
      <Flexbox gap={24}>
        <InputSchemaRender id={id} type={id} readonly />
      </Flexbox>
    </BasicNode.Preview>
  );
});

export { DefaultPreview };
