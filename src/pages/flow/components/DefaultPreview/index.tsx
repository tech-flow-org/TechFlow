import { BasicNode } from 'kitchen-flow-editor';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { InputSchemaRender } from '../InputSchemaRender';
import { symbolNodeList } from '../nodes';

const DefaultPreview = memo<{ id: string }>(({ id }) => {
  const nodeConfig = symbolNodeList.find((item) => item.id === id);

  return (
    <BasicNode.Preview title={nodeConfig?.id}>
      <Flexbox gap={24}>
        <InputSchemaRender id={id} type={id} readonly />
      </Flexbox>
    </BasicNode.Preview>
  );
});

export { DefaultPreview };
