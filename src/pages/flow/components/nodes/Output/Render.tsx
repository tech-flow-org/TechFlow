import { DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import { LinkBreak1Icon } from '@radix-ui/react-icons';
import { App, Result, Select } from 'antd';
import isEqual from 'fast-deep-equal';
import { BasicNode, NodeField, memoEqual, useFlowEditor } from 'kitchen-flow-editor';
import { TargetIcon, WifiIcon } from 'lucide-react';
import { memo } from 'react';

import { flowSelectors, useFlowStore } from '@/store/flow';
import { OutputNodeContent } from '@/types/flow';

import { IconAction } from '@/components/IconAction';
import Markdown from '@/components/Markdown';
import { StringTemplate } from '@/utils/StringTemplate';
import { useReactFlow } from 'reactflow';
import { OutputNodeProps } from '../types';

const OutputNode = memo<OutputNodeProps>(({ id, selected }) => {
  const [variable, showPreview, outputTemplate, previewData, isLinked] = useFlowStore((s) => {
    const node = flowSelectors.getNodeContentById<OutputNodeContent>(id)(s);
    const flow = flowSelectors.currentFlowSafe(s);
    const previewData = flowSelectors.getSourceDataOfNode(id)(s);
    const variables = flowSelectors.getResultVariables(s);
    const isLinked = variables.some((v) => v.name === node?.variable && v.sourceId);

    return [node?.variable, node?.preview, flow.outputTemplate, previewData, isLinked];
  }, isEqual);

  const { modal } = App.useApp();

  const editor = useFlowEditor();

  const reflow = useReactFlow();
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
          <IconAction
            key="out"
            title={'此节点会将导入的内容输出到控制台'}
            icon={<WifiIcon size={16} />}
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
      style={{ width: 400 }}
    >
      <NodeField title={'变量名'} id={'variable'}>
        <Select
          allowClear
          placeholder={'请输入变量名'}
          value={variable}
          style={{ width: '100%' }}
          options={new StringTemplate(outputTemplate).variableNames.map((v) => ({ value: v }))}
          onChange={(e) => {
            editor.updateNodeContent<OutputNodeContent>(id, 'variable', e);
          }}
          className={'nodrag'}
        />
      </NodeField>
      <NodeField
        title={'输出来源'}
        id={'sourceId'}
        handles={{ source: true }}
        extra={
          !isLinked
            ? undefined
            : [
                {
                  title: showPreview ? '隐藏预览' : '显示预览',
                  icon: <TargetIcon size={16} />,
                  onClick: () => {
                    editor.updateNodeContent<OutputNodeContent>(id, 'preview', !showPreview);
                  },
                },
              ]
        }
      >
        {showPreview ? (
          <Markdown>{previewData ?? '来源的内容为空'}</Markdown>
        ) : (
          <Result
            icon={
              isLinked ? (
                <LinkOutlined />
              ) : (
                <LinkBreak1Icon className={'anticon'} width={84} height={84} />
              )
            }
            subTitle={isLinked ? '已关联来源节点' : '暂未关联节点'}
          />
        )}
      </NodeField>
    </BasicNode>
  );
}, memoEqual);

export default OutputNode;
