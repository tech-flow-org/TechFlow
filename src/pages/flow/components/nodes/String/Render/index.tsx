import { App, Input } from 'antd';
import { memo } from 'react';
import { NodeProps, useReactFlow } from 'reactflow';
import { shallow } from 'zustand/shallow';

import { flowSelectors, useFlowStore } from '@/store/flow';
import { StringNodeContent } from '@/types/flow';
import { DeleteOutlined } from '@ant-design/icons';
import { BasicNode, NodeField, memoEqual, useFlowEditor } from 'kitchen-flow-editor';

const InputNode = memo<NodeProps>(({ id, selected }) => {
  const [value, title] = useFlowStore((s) => {
    const node = flowSelectors.getNodeByIdSafe<StringNodeContent>(id)(s);
    return [node.data.content.text, node.data.meta.title];
  }, shallow);

  const { modal } = App.useApp();

  const editor = useFlowEditor();

  const reflow = useReactFlow();

  return (
    <BasicNode
      id={id}
      title={title}
      active={selected}
      extra={[
        <div
          key="delete"
          onClick={() => {
            modal.confirm({
              type: 'warning',
              title: '确认删除节点吗？',
              centered: true,
              okButtonProps: { danger: true },
              okText: '删除节点',
              cancelText: '取消',
              onOk: () => {
                reflow.deleteElements({ nodes: [{ id }] });
              },
            });
          }}
        >
          <DeleteOutlined />
        </div>,
      ]}
    >
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
