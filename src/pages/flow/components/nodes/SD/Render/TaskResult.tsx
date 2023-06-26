import { DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { NodeField, useFlowEditor } from 'kitchen-flow-editor';
import { memo } from 'react';
import { shallow } from 'zustand/shallow';

import { flowSelectors, useFlowStore } from '@/store/flow';
import { AITaskContent } from '@/types/flow';
import { Button, Empty, Image } from 'antd';

interface TaskResultProps {
  id: string;
}

const TaskResult = memo<TaskResultProps>(({ id }) => {
  const [output, collapsed, loading, runFlowNode] = useFlowStore((s) => {
    const task = flowSelectors.getNodeContentById(id)(s);
    const node = flowSelectors.getNodeByIdSafe(id)(s);
    return [task?.output || '', task?.collapsed, node.data.state?.loading, s.runFlowNode];
  }, shallow);

  const editor = useFlowEditor();
  const hasData = !!output;
  return (
    <NodeField
      id={'output'}
      title={'运行结果'}
      collapsed={collapsed}
      onCollapsedChange={(collapsed) => {
        editor.updateNodeContent<AITaskContent>(id, 'collapsed', collapsed);
      }}
      valueContainer={false}
      handles={{ target: true }}
      extra={
        !output
          ? []
          : [
              {
                icon: <DeleteOutlined />,
                title: '删除',
                onClick: () => {
                  editor.updateNodeContent<AITaskContent>(id, 'output', undefined);
                },
              },
            ]
      }
    >
      {!hasData ? (
        <Empty description={'暂无执行结果'} image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Button
            size={'large'}
            style={{ fontSize: 14 }}
            icon={<PlayCircleOutlined />}
            onClick={() => runFlowNode(id)}
            loading={loading}
          >
            运行任务
          </Button>
        </Empty>
      ) : (
        <Image src={output} alt="文生图节点" />
      )}
    </NodeField>
  );
});

export default TaskResult;
