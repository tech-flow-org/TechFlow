import { useDebounce } from 'ahooks';
import { createStyles } from 'antd-style';
import { BasicNode } from 'kitchen-flow-editor';
import { ReactNode, memo, useEffect, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { InputSchemaRender } from '@/pages/flow/components/InputSchemaRender';
import { flowSelectors, useFlowStore } from '@/store/flow';
import { ConfigProvider } from 'antd';

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
    const [collapsedKeys] = useFlowStore((s) => {
      const agent = flowSelectors.getNodeByIdSafe(id)(s);
      return [agent.data.state?.collapsedKeys, s.runFlowNode, s.abortFlowNode];
    }, shallow);

    const { styles, cx } = useStyles();

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

    const htmlRef = useRef<HTMLDivElement>(null);

    return (
      <ConfigProvider
        getPopupContainer={() => {
          return htmlRef.current || document.body;
        }}
      >
        <div ref={htmlRef} />
        <BasicNode
          id={id}
          title={title}
          active={selected}
          collapsedKeys={collapsedKeys}
          extra={headerExtra}
          className={cx(styles.container, className, showProgress && styles.progress)}
          style={{ '--task-loading-progress': `${percent}%` } as any}
        >
          <InputSchemaRender id={id} />
        </BasicNode>
      </ConfigProvider>
    );
  },
);

export default TaskDefinition;
