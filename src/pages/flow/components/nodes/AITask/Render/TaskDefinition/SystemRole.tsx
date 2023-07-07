import { ArrowsAltOutlined, EditOutlined, SmileOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { NodeField, useFlowEditor } from 'kitchen-flow-editor';
import { memo, useState } from 'react';
import { shallow } from 'zustand/shallow';

import AgentAvatar from '@/components/AgentAvatar';
import { EditableMessage } from '@/components/Chat';
import { flowSelectors, useFlowStore } from '@/store/flow';
import { useMaskStore } from '@/store/mask';
import { AITaskContent } from '@/types/flow';
import { List, Modal } from 'antd';
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

  const maskStore = useMaskStore();
  const masks = maskStore.getAll();

  const [open, setOpen] = useState(false);

  return (
    <NodeField
      title={'节点任务设定'}
      id={'systemRole'}
      extra={[
        { icon: <ArrowsAltOutlined />, title: '展开', onClick: () => setExpand(!expand) },
        {
          icon: <SmileOutlined />,
          title: '选择角色',
          onClick: () => {
            setOpen(true);
          },
        },
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
      <Modal
        title="👺 选择角色"
        bodyStyle={{
          height: '60vh',
          overflowY: 'scroll',
          margin: '0 -24px',
          padding: '0 24px',
        }}
        onCancel={() => setOpen(false)}
        open={open}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={masks}
          renderItem={(item) => {
            let avatar = item.avatar;
            try {
              avatar = item.avatar ? String.fromCodePoint(parseInt(item.avatar, 16)) : '🤖';
            } catch (error) {}
            return (
              <List.Item
                id={item.id + ''}
                actions={[
                  <a
                    key="check"
                    onClick={() => {
                      editor.updateNodeContent<AITaskContent>(
                        id,
                        'systemRole',
                        item.context.map((c) => c.content).join('\n'),
                      );
                      setOpen(false);
                    }}
                  >
                    选择
                  </a>,
                ]}
              >
                <List.Item.Meta
                  avatar={<AgentAvatar background="#FFF" title="头像" size={48} avatar={avatar} />}
                  title={item.name}
                  description={
                    <div
                      style={{
                        wordBreak: 'break-all',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {item.context.at(0)?.content}
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Modal>
    </NodeField>
  );
});

export default SystemRole;
