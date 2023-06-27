import { ArrowsAltOutlined, EditOutlined } from '@ant-design/icons';
import isEqual from 'fast-deep-equal';
import { NodeField, useFlowEditor } from 'kitchen-flow-editor';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { EditableMessage } from '@/components/Chat';
import { flowSelectors, useFlowStore } from '@/store/flow';

import { OutputNodeContent } from '@/types/flow';
import { VariableHandle } from './VariableHandle';

interface TaskExampleProps {
  id: string;
}

const TaskExample = memo<TaskExampleProps>(({ id }) => {
  const [chatExample] = useFlowStore((s) => {
    const content = flowSelectors.getNodeContentById<OutputNodeContent>(id)(s);
    return [content];
  }, isEqual);
  const editor = useFlowEditor();

  const [isEdit, setTyping] = useState(false);
  const [expand, setExpand] = useState(false);

  return (
    <NodeField
      id={'input'}
      title={
        <Flexbox horizontal gap={8} align={'center'}>
          提示词输入
        </Flexbox>
      }
      extra={[
        {
          icon: <ArrowsAltOutlined />,
          title: '展开',
          onClick: () => setExpand(!expand),
        },
        {
          icon: <EditOutlined />,
          title: '编辑',
          onClick: () => setTyping(true),
        },
      ]}
    >
      <Flexbox className={'nodrag'}>
        <VariableHandle
          handleId={'task'}
          chatMessages={Object.values(JSON.parse('{"images":"{images}","text":"{text}"}'))}
        />
        {isEdit ? (
          <EditableMessage
            showEditWhenEmpty
            openModal={expand}
            placeholder="请输入提示词,以逗号分隔，如：Hello World,1cubemonster,<lora:cubemonster-000018:0.8> "
            onOpenChange={setExpand}
            value={chatExample?.data}
            editing={isEdit}
            onEditingChange={setTyping}
            onChange={(text) => {
              editor.updateNodeContent(id, 'data', text);
            }}
          />
        ) : (
          <div style={{ width: '100%' }}>{chatExample?.data}</div>
        )}
      </Flexbox>
    </NodeField>
  );
}, isEqual);

export default TaskExample;
