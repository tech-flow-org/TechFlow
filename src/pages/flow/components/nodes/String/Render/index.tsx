import { flowSelectors, useFlowStore } from '@/store/flow';
import { DeleteOutlined } from '@ant-design/icons';
import { App } from 'antd';
import { BasicNode, memoEqual } from 'kitchen-flow-editor';
import { isEqual } from 'lodash-es';
import { memo } from 'react';
import { NodeProps, useReactFlow } from 'reactflow';
import { InputSchemaRender } from '../../../InputSchemaRender';

const InputNode = memo<NodeProps>(({ id, selected }) => {
  const [title] = useFlowStore((s) => {
    const { meta } = flowSelectors.getNodeByIdSafe(id)(s).data;

    return [meta?.title];
  }, isEqual);

  const { modal } = App.useApp();

  const reflow = useReactFlow();

  return (
    <BasicNode
      id={id}
      title={title}
      onTitleChange={() => {}}
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
      <InputSchemaRender id={id} />
    </BasicNode>
  );
}, memoEqual);

export default InputNode;
