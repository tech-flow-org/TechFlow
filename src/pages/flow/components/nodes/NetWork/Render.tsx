import { flowSelectors, useFlowStore } from '@/store/flow';
import { OutputNodeContent } from '@/types/flow';
import { DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { App, Input } from 'antd';
import isEqual from 'fast-deep-equal';
import { BasicNode, NodeField, memoEqual, useFlowEditor } from 'kitchen-flow-editor';
import { memo, useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { IconAction } from '@/components/IconAction';
import { createStyles } from 'antd-style';
import { useReactFlow } from 'reactflow';
import { OutputNodeProps } from '../types';
import TaskExample from './TaskExample';

const useStyles = createStyles(({ css, token, prefixCls, isDarkMode }) => ({
  container: css`
    .${prefixCls}-card-head {
      position: relative;
      &-wrapper {
        z-index: 1;
      }
    }
  `,
  progress: css`
    .${prefixCls}-card-head {
      :before {
        position: absolute;
        top: -1px;
        left: 0;

        display: block;

        width: var(--task-loading-progress, 0);
        height: 10px;

        background-image: linear-gradient(
          to right,
          ${isDarkMode ? token.cyan6 : token.cyan3},
          ${isDarkMode ? token.blue6 : token.blue4}
        );
        border-radius: 8px;
        border-bottom-left-radius: 0;

        transition: all 300ms ease-out;
      }
    }
  `,
}));

const OutputNode = memo<
  OutputNodeProps & {
    loading?: boolean;
  }
>(({ id, selected, loading }) => {
  const [node] = useFlowStore((s) => {
    const node = flowSelectors.getNodeContentById<OutputNodeContent>(id)(s);
    return [node];
  }, isEqual);
  const { styles, theme, cx } = useStyles();
  const [runFlowNode, abortFlowNode] = useFlowStore((s) => {
    return [s.runFlowNode, s.abortFlowNode];
  }, shallow);
  const { modal } = App.useApp();

  const editor = useFlowEditor();

  const reflow = useReactFlow();

  const [percent, setPercent] = useState(10);

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    if (loading) {
      intervalId = setInterval(() => {
        setPercent((prevProgress) => {
          const nextProgress = prevProgress + 1;

          if (nextProgress >= 90) {
            clearInterval(intervalId);
          }

          return nextProgress;
        });
      }, 300);
    } else {
      setPercent(100);
      setTimeout(() => {
        setPercent(0);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [loading]);

  return (
    <BasicNode
      id={id}
      title={'结果输出'}
      active={selected}
      extra={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          {loading ? (
            <IconAction
              title={'停止'}
              type={'danger'}
              icon={
                <div
                  style={{ width: 16, height: 16, borderRadius: 2, background: theme.colorError }}
                />
              }
              onClick={() => {
                abortFlowNode(id);
              }}
            />
          ) : null}
          <IconAction
            title={'执行节点'}
            loading={loading}
            icon={<PlayCircleOutlined />}
            onClick={() => {
              runFlowNode(id);
            }}
          />
          <IconAction
            icon={<DeleteOutlined />}
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
          />
        </div>
      }
      className={cx(styles.container, styles.progress)}
      style={{ '--task-loading-progress': `${percent}%` } as any}
    >
      <NodeField title={'网络地址'} id={'url'}>
        <Input
          allowClear
          style={{ width: '100%' }}
          placeholder={'请输入网络'}
          value={node.url}
          onChange={(e) => {
            editor.updateNodeContent<OutputNodeContent>(id, 'url', e.target.value);
          }}
          className={'nodrag'}
        />
      </NodeField>
      <NodeField title={'请求字段'} id={'source'} handles={{ source: true }}>
        <TaskExample id={id} />
      </NodeField>
    </BasicNode>
  );
}, memoEqual);

export default OutputNode;
