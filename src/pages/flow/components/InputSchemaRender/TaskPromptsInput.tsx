import {
  ArrowsAltOutlined,
  EditOutlined,
  MessageOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { NodeField, useFlowEditor } from '@ant-design/pro-flow-editor';
import { Segmented } from 'antd';
import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo, useCallback, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChatMessageList, EditableMessage } from '@/components/Chat';
import { flowSelectors, useFlowStore } from '@/store/flow';
import { ChatExample } from '@/types';
import { VariableHandle } from './VariableHandle';

const useStyles = createStyles(({ css }) => ({
  handleContainer: css`
    position: absolute;
    left: -12px;
    padding-top: 8px;
  `,
  segment: css`
    font-weight: normal;
  `,
  handle: css`
    position: relative;
    top: 0;
    left: 0;
    transform: none;
  `,
}));

interface TaskPromptsInputProps {
  id: string;
  valueKey: string;
  value: ChatExample;
  title: React.ReactNode;
  onChange: (value: ChatExample) => void;
}

const TaskPromptsInput = memo<TaskPromptsInputProps>(({ id, ...props }) => {
  const { styles } = useStyles();

  const [disabled, mode] = useFlowStore((s) => {
    const content = flowSelectors.getNodeContentById(id)(s);
    const node = flowSelectors.getNodeByIdSafe(id)(s);

    return [node.data.state?.loading, content?.mode];
  }, isEqual);
  const editor = useFlowEditor();

  const [isEdit, setTyping] = useState(false);
  const [expand, setExpand] = useState(false);

  const isArray = mode === 'chat';

  const onExampleChange = useCallback((value: ChatExample) => {
    props.onChange(value);
  }, []);

  return (
    <NodeField
      id={'input'}
      title={
        <Flexbox horizontal gap={8} align={'center'}>
          <span>{props.title}</span>
          <Segmented
            value={mode}
            className={styles.segment}
            options={[
              { value: 'prompt', label: '单项', icon: <MessageOutlined /> },
              { value: 'chat', label: '多项', icon: <UnorderedListOutlined /> },
            ]}
            onChange={(value) => {
              editor.updateNodeContent(id, 'mode', value);
            }}
          />
        </Flexbox>
      }
      extra={
        isArray
          ? []
          : [
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
            ]
      }
    >
      <Flexbox className={'nodrag'}>
        <VariableHandle handleId={'task.input'} chatMessages={props.value} />
        {isArray ? (
          <ChatMessageList
            disabled={disabled}
            dataSources={props.value}
            onChange={onExampleChange}
          />
        ) : (
          <EditableMessage
            showEditWhenEmpty
            openModal={expand}
            onOpenChange={setExpand}
            value={props.value?.[0]?.content}
            editing={isEdit}
            onEditingChange={setTyping}
            onChange={(text) => {
              props.onChange([{ role: 'user', content: text }]);
            }}
          />
        )}
      </Flexbox>
    </NodeField>
  );
}, isEqual);

export default TaskPromptsInput;
