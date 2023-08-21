import { DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { NodeField, useFlowEditor } from '@ant-design/pro-flow-editor';
import { memo, useMemo } from 'react';
import { shallow } from 'zustand/shallow';

import { EditableMessage } from '@/components/Chat';
import Highlighter from '@/components/Highlighter';
import { flowSelectors, useFlowStore } from '@/store/flow';
import { AITaskContent, OutputNodeContent } from '@/types/flow';
import { Button, Empty, Image } from 'antd';
import { SymbolNodeRenderMap } from '../nodes';

interface TaskResultProps {
  id: string;
}

export const OutputRender: React.FC<{
  id: string;
  type: string;
}> = ({ id, type }) => {
  const [output, outputType, task] = useFlowStore((s) => {
    const task = flowSelectors.getNodeContentById<OutputNodeContent>(id)(s);
    return [task?.output || '', task?.outputType, task];
  }, shallow);

  const outputRender = useMemo(() => {
    return SymbolNodeRenderMap[type || 'string'];
  }, [type]);

  const editor = useFlowEditor();

  if (outputType === 'text') {
    return (
      <EditableMessage
        value={output}
        onChange={(text) => {
          //  此处为系统自动执行，因此不需要记录历史
          editor.updateNodeContent(id, 'output', text, { recordHistory: false });
        }}
      />
    );
  }

  if (outputRender) {
    return outputRender(output, task);
  }

  if (outputType === 'img') {
    return <Image src={output} alt="文生图节点" />;
  }

  if (outputType === 'json') {
    return <Highlighter language="json">{output}</Highlighter>;
  }

  return <Empty description="未知数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
};

const TaskResult = memo<TaskResultProps>(({ id }) => {
  const [output, collapsed, loading, runFlowNode, nodeType] = useFlowStore((s) => {
    const task = flowSelectors.getNodeContentById(id)(s);
    const node = flowSelectors.getNodeByIdSafe(id)(s);
    return [
      task?.output || '',
      task?.collapsed,
      node.data.state?.loading,
      s.runFlowNode,
      node.type,
    ];
  }, shallow);

  const hasData = !!output;

  const editor = useFlowEditor();

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
        <div
          onWheel={(e) => {
            e.stopPropagation();
          }}
          style={{
            maxHeight: 200,
            overflow: 'auto',
          }}
        >
          <OutputRender id={id} type={nodeType || 'string'} />
        </div>
      )}
    </NodeField>
  );
});

export default TaskResult;
