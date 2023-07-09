import isEqual from 'fast-deep-equal';
import { Flexbox } from 'react-layout-kit';

import { flowSelectors, useFlowStore } from '@/store/flow';

import { DraggablePanel } from '@/components/DraggablePanel';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { useTheme } from 'antd-style';
import { NodeField } from 'kitchen-flow-editor';
import { shallow } from 'zustand/shallow';
import Preview from './Preview';

const Terminal = () => {
  const [flattenNodes, loading, runFlow, editor] = useFlowStore((s) => {
    const flow = flowSelectors.currentFlowSafe(s);
    return [flow.flattenNodes, flow.state.runningTask, s.runFlow, s.editor];
  }, isEqual);

  const [terminalHeight, showTerminal] = useFlowStore(
    (s) => [s.terminalHeight, s.showTerminal],
    shallow,
  );

  const inputNodes = Object.values(flattenNodes).filter((n) => n.type === 'string');

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
          useFlowStore.setState({
            showTerminal: expand,
            terminalHeight: expand ? (document.body.clientHeight / 3) * 2 : 0,
          });
        }}
        size={{ width: '100%', height: terminalHeight }}
        onSizeChange={(_, size) => {
          useFlowStore.setState({ terminalHeight: parseInt(size?.height as string) });
        }}
        style={{ paddingInline: 12, background: theme.colorBgContainer, transition: 'height 0.3s' }}
        placement={'bottom'}
      >
        <Flexbox horizontal style={{ paddingTop: 16 }} gap={40} height={'100%'}>
          <Flexbox
            flex={2}
            gap={8}
            height={'100%'}
            style={{ overflowY: 'scroll', paddingRight: 8, paddingBottom: 16 }}
          >
            <NodeField valueContainer={false} title={'输入'} id={'input'}>
              <ProForm
                onFinish={async (values) => {
                  Object.keys(values).forEach((key) => {
                    if (values[key] !== undefined) {
                      editor.updateNodeContent(key, 'text', values[key]);
                      editor.updateNodeContent(key, 'output', values[key]);
                    }
                  });
                  runFlow?.();
                }}
                submitter={{
                  searchConfig: {
                    submitText: '运行',
                  },
                  submitButtonProps: {
                    loading,
                  },
                  resetButtonProps: false,
                }}
              >
                {inputNodes.map((node) => {
                  return (
                    <ProFormText
                      initialValue={node.data.content.text}
                      key={node.id}
                      name={node.id}
                      label={node.data.meta.title}
                    />
                  );
                })}
              </ProForm>
            </NodeField>
          </Flexbox>
          <Preview />
        </Flexbox>
      </DraggablePanel>
    </div>
  );
};

export default Terminal;
