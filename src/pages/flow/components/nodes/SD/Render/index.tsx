import { DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { App, Dropdown } from 'antd';
import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memoEqual, useFlowEditor } from 'kitchen-flow-editor';
import { memo, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';
import { useReactFlow } from 'reactflow';

import { IconAction } from '@/components/IconAction';
import { flowSelectors, useFlowStore } from '@/store/flow';

import TaskDefinition from './TaskDefinition';
import TaskResult from './TaskResult';

import type { AITaskNodeProps } from '../../types';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    width: ${token.aiTaskNodeWidth}px;
    background: ${token.colorBgLayout};
    border: 2px solid ${token.colorBorder};
    border-radius: 14px;
  `,
  active: css`
    border-color: ${token.colorPrimary};
    box-shadow: 0 9px 25px -6px rgba(0, 0, 0, 0.1);
  `,
  node: css`
    border-width: 0;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 2px 1px, rgba(0, 0, 0, 0.02) 0px 4px 2px,
      rgba(0, 0, 0, 0.02) 0px 8px 4px, rgba(0, 0, 0, 0.02) 0px 16px 8px,
      rgba(0, 0, 0, 0.02) 0px 32px 16px;
  `,
  result: css``,
}));

const Agent = memo<AITaskNodeProps>(({ selected, id }) => {
  const { styles, cx } = useStyles();
  const { modal } = App.useApp();

  const reactflow = useReactFlow();
  const editor = useFlowEditor();
  const [loading, title] = useFlowStore((s) => {
    const { meta, state } = flowSelectors.getNodeByIdSafe(id)(s).data;
    return [state?.loading, meta?.title];
  }, isEqual);

  useEffect(() => {
    editor.updateNodeState(id, 'loading', false, { recordHistory: false });
  }, []);
  return (
    <Flexbox className={cx(styles.container, selected && styles.active)}>
      <TaskDefinition
        id={id}
        title={title}
        headerExtra={
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  icon: <DeleteOutlined />,
                  label: '删除节点',
                  key: 'delete',
                  danger: true,
                  onClick: () => {
                    modal.confirm({
                      type: 'warning',
                      title: '确认删除节点吗？',
                      centered: true,
                      okButtonProps: { danger: true },
                      okText: '删除节点',
                      cancelText: '取消',
                      onOk: () => {
                        reactflow.deleteElements({ nodes: [{ id }] });
                      },
                    });
                  },
                },
              ].filter(Boolean),
            }}
          >
            <IconAction icon={<MoreOutlined />} />
          </Dropdown>
        }
        loading={loading}
        selected={selected}
        className={styles.node}
      />
      <Flexbox padding={24} gap={12} className={styles.result}>
        <TaskResult id={id} />
      </Flexbox>
    </Flexbox>
  );
}, memoEqual);

export default Agent;
