import { ArrowsAltOutlined, EditOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { NodeField, useFlowEditor } from 'kitchen-flow-editor';
import { memo, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { EditableMessage } from '@/components/Chat';
import { flowSelectors, useFlowStore } from '@/store/flow';
import { AITaskContent } from '@/types/flow';
import { VariableHandle } from './VariableHandle';

const useStyles = createStyles(({ css }) => ({
  md: css`
    overflow: hidden;
    max-height: 400px;
  `,
}));

const SystemRole = memo(({ id }: { id: string }) => {
  const { styles, cx } = useStyles();

  const [isEdit, setTyping] = useState(false);

  const [expand, setExpand] = useState(false);

  const [value] = useFlowStore((s) => {
    const node = flowSelectors.getNodeByIdSafe(id)(s);
    return [node.data.content.systemRole];
  }, shallow);

  const editor = useFlowEditor();

  return (
    <NodeField
      title={'节点任务设定'}
      id={'systemRole'}
      extra={[
        { icon: <ArrowsAltOutlined />, title: '展开', onClick: () => setExpand(!expand) },
        {
          icon: <EditOutlined />,
          title: '编辑',
          onClick: () => setTyping(true),
        },
      ]}
    >
      <VariableHandle handleId={'content'} chatMessages={[{ role: 'system', content: value }]} />
      <EditableMessage
        openModal={expand}
        onOpenChange={setExpand}
        value={value}
        editing={isEdit}
        onEditingChange={setTyping}
        onChange={(text) => {
          editor.updateNodeContent<AITaskContent>(id, 'systemRole', text);
        }}
        classNames={{
          markdown: styles.md,
          input: cx('nodrag', 'nowheel'),
        }}
      />
    </NodeField>
  );
});

export default SystemRole;
