import { DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { BasicFlowNodeProps, memoEqual } from '@ant-design/pro-flow-editor';
import { App } from 'antd';
import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { IconAction } from '@/components/IconAction';
import { flowSelectors, useFlowStore } from '@/store/flow';

import { shallow } from 'zustand/shallow';
import { SymbolNodeRunMap } from '../nodes';
import TaskDefinition from './TaskDefinition';
import TaskResult from './TaskResult';

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

const ActionList = ({ id, hasRun }: { id: string; hasRun: boolean }) => {
  const { modal } = App.useApp();
  const { theme } = useStyles();

  const [deleteNode] = useFlowStore((s) => {
    return [s.editor.deleteNode];
  }, shallow);
  const [runFlowNode, abortFlowNode] = useFlowStore((s) => {
    return [s.runFlowNode, s.abortFlowNode];
  }, shallow);

  const [loading] = useFlowStore((s) => {
    const node = flowSelectors.getNodeByIdSafe<Record<string, any>>(id)(s);
    const { state } = node.data;
    return [state?.loading];
  }, isEqual);

  return (
    <Flexbox gap={8} align="center" direction="horizontal">
      {loading ? (
        <IconAction
          key={'abort'}
          title={'停止'}
          type={'danger'}
          icon={
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 2,
                background: theme.colorError,
              }}
            />
          }
          onClick={() => {
            abortFlowNode(id);
          }}
        />
      ) : (
        hasRun && (
          <IconAction
            key={'run'}
            title={'执行节点'}
            loading={loading}
            icon={<PlayCircleOutlined />}
            onClick={() => {
              runFlowNode(id);
            }}
          />
        )
      )}

      <IconAction
        icon={<DeleteOutlined />}
        onClick={() => {
          modal.confirm({
            type: 'warning',
            title: '确认删除节点吗？',
            centered: true,
            okButtonProps: { danger: true },
            okText: '删除节点',
            cancelText: '取消',
            onOk: () => {
              deleteNode(id);
            },
          });
        }}
      />
    </Flexbox>
  );
};

const DefaultRender = memo<BasicFlowNodeProps<Record<string, any>>>(({ selected, id }) => {
  const { styles, cx } = useStyles();

  const [loading, title, type] = useFlowStore((s) => {
    const node = flowSelectors.getNodeByIdSafe<Record<string, any>>(id)(s);
    const { meta, state } = node.data;
    return [state?.loading, meta?.title, node.type];
  }, shallow);

  const runFunction = useMemo(() => !!SymbolNodeRunMap[type || 'string'], [type]);

  return (
    <Flexbox className={cx(styles.container, selected && styles.active)}>
      <TaskDefinition
        id={id}
        title={title}
        headerExtra={<ActionList id={id} hasRun={runFunction} />}
        loading={loading}
        selected={selected}
        className={styles.node}
      />
      {runFunction ? (
        <Flexbox padding={24} gap={12} className={styles.result}>
          <TaskResult id={id} />
        </Flexbox>
      ) : null}
    </Flexbox>
  );
}, memoEqual);

export { DefaultRender };
