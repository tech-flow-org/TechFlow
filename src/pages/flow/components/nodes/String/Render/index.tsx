import { Input } from 'antd';
import { memo } from 'react';
import { NodeProps } from 'reactflow';
import { shallow } from 'zustand/shallow';

import { flowSelectors, useFlowStore } from '@/store/flow';
import { StringNodeContent } from '@/types/flow';
import { BasicNode, memoEqual, NodeField, useFlowEditor } from 'kitchen-flow-editor';

const InputNode = memo<NodeProps>(({ id, selected }) => {
  const [value, title] = useFlowStore((s) => {
    const node = flowSelectors.getNodeByIdSafe<StringNodeContent>(id)(s);
    return [node.data.content.text, node.data.meta.title];
  }, shallow);
  const editor = useFlowEditor();

  return (
    <BasicNode id={id} title={title} active={selected}>
      <NodeField valueContainer={false} title={'文本'} id={'text'} handles={{ target: 'text' }}>
        <Input.TextArea
          value={value}
          className={'nowheel nodrag'}
          onChange={(e) => {
            editor.updateNodeContent<StringNodeContent>(id, 'text', e.target.value);
          }}
          placeholder={'请输入内容'}
        />
      </NodeField>
    </BasicNode>
  );
}, memoEqual);

export default InputNode;
