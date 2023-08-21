import { memo } from 'react';

import { VariableHandle } from './VariableHandle';

export const VarShow = memo(({ id, ...props }: { id: string; value: string }) => {
  return (
    <div id={id}>
      <VariableHandle
        handleId={'content'}
        chatMessages={[{ role: 'system', content: props.value }]}
      />
      {props.value}
    </div>
  );
});
