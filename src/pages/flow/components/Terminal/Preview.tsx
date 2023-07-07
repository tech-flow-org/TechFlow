import isEqual from 'fast-deep-equal';

import Highlighter from '@/components/Highlighter';
import { flowSelectors, useFlowStore } from '@/store/flow';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Collapse, Descriptions, Steps } from 'antd';
import { NodeField } from 'kitchen-flow-editor';
import { useMemo } from 'react';
import { SymbolNodeRenderMap } from '../nodes';
import { useStyles } from './style';

const Preview = () => {
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
        .filter((n) => n)
        .filter((n) => n?.type !== 'string')
        ?.findIndex((node) => node.id === currentTask?.id || '') || 0,
    [taskList?.join('-'), currentTask?.id],
  );

  const { styles } = useStyles();

  return (
    <NodeField
      valueContainer={false}
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>结果预览</span>
          {loading ? <LoadingOutlined /> : null}
        </div>
      }
      id={'result'}
      style={{ height: '100%', flex: 4 }}
    >
      <div style={{ overflowY: 'scroll', paddingBottom: 16 }}>
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
              .filter((n) => n)
              .filter((n) => n?.type !== 'string')
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
              .filter((n) => n)
              .filter((n) => n?.type !== 'string')
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
                          {SymbolNodeRenderMap[flowNode.type || 'string']?.(
                            data.content.output,
                            data,
                          )}
                        </div>
                      </Descriptions.Item>
                    </Descriptions>
                  ),
                };
              })}
          />
        </div>
      </div>
    </NodeField>
  );
};

export default Preview;
