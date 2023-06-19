import { LinkOutlined } from '@ant-design/icons';
import { LinkBreak1Icon } from '@radix-ui/react-icons';
import { Input, Tag } from 'antd';
import isEqual from 'fast-deep-equal';
import { Flexbox } from 'react-layout-kit';

import { flowSelectors, useFlowStore } from '@/store/flow';

import { DraggablePanel } from '@/components/DraggablePanel';
import { useTheme } from 'antd-style';
import { NodeField } from 'kitchen-flow-editor';
import { shallow } from 'zustand/shallow';
import Preview from './Preview';

const Terminal = () => {
  const [id, input, template, variables, dispatchFlow] = useFlowStore((s) => {
    const flow = flowSelectors.currentFlowSafe(s);

    const variables = flowSelectors.getResultVariables(s);
    return [flow.id, flow.previewInput, flow.outputTemplate, variables, s.dispatchFlow];
  }, isEqual);
  const [terminalHeight, showTerminal] = useFlowStore(
    (s) => [s.terminalHeight, s.showTerminal],
    shallow,
  );

  const theme = useTheme();
  return (
    <div
      style={{
        gridArea: 'terminal',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        left: 0,
        right: 0,
      }}
    >
      <DraggablePanel
        isExpand={showTerminal}
        onExpandChange={(expand) => {
          useFlowStore.setState({ showTerminal: expand, terminalHeight: expand ? 300 : 0 });
        }}
        size={{ width: '100%', height: terminalHeight }}
        onSizeChange={(_, size) => {
          useFlowStore.setState({ terminalHeight: parseInt(size?.height as string) });
        }}
        style={{ paddingInline: 12, background: theme.colorBgContainer }}
        placement={'bottom'}
      >
        <Flexbox horizontal style={{ paddingTop: 16 }} gap={40} height={'100%'}>
          <Flexbox
            flex={2}
            gap={8}
            height={'100%'}
            style={{ overflowY: 'scroll', paddingRight: 8, paddingBottom: 16 }}
          >
            <NodeField id={'template'} valueContainer={false} title={'输出模板'}>
              <Input.TextArea
                value={template}
                placeholder={'请定义该流程的输出结果'}
                style={{ height: 200 }}
                onChange={(e) => {
                  dispatchFlow({
                    type: 'updateFlow',
                    id,
                    flow: { outputTemplate: e.target.value },
                  });
                }}
              />

              <Flexbox horizontal gap={8}>
                {variables.map((v) => (
                  <Tag
                    key={v.name}
                    color={v.sourceId ? 'green' : v.nodeId ? 'blue' : undefined}
                    bordered={false}
                    style={{ gap: 4, display: 'flex' }}
                  >
                    {v.sourceId ? (
                      <LinkOutlined />
                    ) : (
                      <span className={'anticon'}>
                        <LinkBreak1Icon width={14} />
                      </span>
                    )}
                    {v.name}
                  </Tag>
                ))}
              </Flexbox>
            </NodeField>
            <NodeField valueContainer={false} title={'输入'} id={'input'}>
              <Input.TextArea
                value={input}
                placeholder={'添加你的测试输入'}
                style={{ height: 200 }}
                onChange={(e) => {
                  dispatchFlow({ type: 'updateFlow', id, flow: { previewInput: e.target.value } });
                }}
              />
            </NodeField>
          </Flexbox>
          <Preview />
        </Flexbox>
      </DraggablePanel>
    </div>
  );
};

export default Terminal;
