import { PlayCircleOutlined } from '@ant-design/icons';
import { useDebounce } from 'ahooks';
import { createStyles } from 'antd-style';
import { BasicNode, NodeField } from 'kitchen-flow-editor';
import { ReactNode, memo, useEffect, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import SystemRole from './SystemRole';
import TaskExample from './TaskExample';

import { IconAction } from '@/components/IconAction';
import { flowSelectors, useFlowStore } from '@/store/flow';
import { ALL_MODELS } from '@/store/mask';
import { Select } from 'antd';

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
interface TaskDefinitionProps {
  selected: boolean;
  loading?: boolean;
  id: string;
  className?: string;
  title?: string;
  headerExtra?: ReactNode;
}

const TaskDefinition = memo<TaskDefinitionProps>(
  ({ loading, id, selected, headerExtra, title, className }) => {
    const [model, collapsedKeys, runFlowNode, abortFlowNode] = useFlowStore((s) => {
      const agent = flowSelectors.getNodeByIdSafe(id)(s);
      return [
        agent.data.content.llm?.model,
        agent.data.state?.collapsedKeys,
        s.runFlowNode,
        s.abortFlowNode,
      ];
    }, shallow);

    const { styles, theme, cx } = useStyles();

    const [percent, setPercent] = useState(10);

    const showProgress = useDebounce(loading, { wait: 1000 });

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
        title={title}
        active={selected}
        collapsedKeys={collapsedKeys}
        extra={
          <Flexbox horizontal gap={4}>
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
            {headerExtra}
          </Flexbox>
        }
        className={cx(styles.container, className, showProgress && styles.progress)}
        style={{ '--task-loading-progress': `${percent}%` } as any}
      >
        <NodeField title={'模型'} id={'model'}>
          <Select
            style={{
              width: '100%',
            }}
            value={model}
            options={ALL_MODELS.map((item) => {
              return {
                label: item.name,
                value: item.name,
              };
            })}
          />
        </NodeField>
        <SystemRole id={id} />
        <TaskExample id={id} />
      </BasicNode>
    );
  },
);

export default TaskDefinition;
