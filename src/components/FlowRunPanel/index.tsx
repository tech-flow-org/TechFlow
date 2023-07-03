import { SymbolNodeRenderMap } from '@/pages/flow/components/nodes';
import { flowSelectors, useFlowStore } from '@/store/flow';
import { Alert, Collapse, Descriptions, Steps } from 'antd';
import { isEqual } from 'lodash-es';
import { memo, useMemo } from 'react';
import Highlighter from '../Highlighter';
import { useStyles } from './style';

export const FlowRunPanel: React.FC = memo(() => {
  const [flattenNodes, loading, currentTask, taskList] = useFlowStore((s) => {
    const flow = flowSelectors.currentFlowSafe(s);
    return [flow.flattenNodes, flow.state.runningTask, flow.state.currentTask, flow.state.taskList];
  }, isEqual);

  // 当前任务在任务列表中的索引
  const currentTaskIndex = useMemo(
    () =>
      taskList
        ?.map((key) => {
          return flattenNodes[key];
        })
        .filter((n) => n.type !== 'string')
        ?.findIndex((node) => node.id === currentTask?.id || '') || 0,
    [taskList?.join('-'), currentTask?.id],
  );

  const { styles } = useStyles();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {currentTask ? (
        <Alert
          banner
          type="info"
          message={<>正在执行任务：{currentTask?.data.meta.title} ...</>}
        ></Alert>
      ) : null}
      <Steps
        style={{
          padding: '0 8px',
          margin: '8px 0',
        }}
        current={currentTaskIndex}
        size="small"
        items={taskList
          ?.map((key) => {
            return flattenNodes[key];
          })
          .filter((n) => n.type !== 'string')
          .map((n, index) => {
            let status: 'process' | 'wait' | 'finish' | undefined = undefined;
            if (index === currentTaskIndex) {
              status = 'process';
            }
            if (index > currentTaskIndex) {
              status = 'wait';
            }
            if (index < currentTaskIndex) {
              status = 'finish';
            }
            return {
              status: status,
              title: n.data?.meta?.title,
              key: n.id,
            };
          })}
      />
      <Collapse
        accordion
        bordered={false}
        activeKey={loading ? [currentTask?.id || taskList?.at(-1) || ''] : undefined}
        size="small"
        items={taskList
          ?.map((key) => {
            return flattenNodes[key];
          })
          .filter((n) => n.type !== 'string')
          .map((flowNode) => {
            const { data } = flowNode;
            return {
              key: flowNode.id,
              label: data?.meta?.title,
              children: (
                <Descriptions column={1}>
                  <Descriptions.Item label="输入">
                    <Highlighter
                      style={{
                        maxWidth: '40vw',
                      }}
                      language="json"
                    >
                      {JSON.stringify(data?.content.params, null, 2)}
                    </Highlighter>
                  </Descriptions.Item>
                  <Descriptions.Item label="输出">
                    <div
                      key={flowNode.id}
                      className={styles.code}
                      style={{
                        overflow: 'auto',
                        width: '100%',
                        maxWidth: '44vw',
                        padding: 8,
                      }}
                    >
                      {data.content.output
                        ? SymbolNodeRenderMap[flowNode.type || 'string']?.(
                            data.content.output,
                            data,
                          )
                        : null}
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              ),
            };
          })}
      />
    </div>
  );
});
