import type { NextPage } from 'next';
import Head from 'next/head';
import { memo, useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import { FlowInputRender } from '@/components/FlowInputRender';
import { FlowRunPanel } from '@/components/FlowRunPanel';
import { Sidebar } from '@/features/Sidebar';
import { useSettings } from '@/store';
import { flowSelectors, useFlowStore } from '@/store/flow';
import { ProForm, ProFormDependency, ProFormInstance, StepsForm } from '@ant-design/pro-components';
import { Button } from 'antd';
import { createStyles } from 'antd-style';
import { FlowEditorProvider, useFlowEditor } from 'kitchen-flow-editor';
import React from 'react';
import { Flexbox } from 'react-layout-kit';
import { FlowSelect } from './components/FlowSelect';

const useStyles = createStyles(({ css }) => {
  return {
    layout: css`
      position: relative;
      width: 100%;
      padding: 24px;
      max-width: 60vw;
      margin: 0 auto;
      background-image: url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr');
      background-size: 100% 100%;
      background-position: left top;
    `,
  };
});

const FlowStepForm = () => {
  const [runFlow] = useFlowStore((s) => [s.runFlow], shallow);

  const editor = useFlowEditor();

  const { styles } = useStyles();

  const flowSelectFormRef = React.useRef<ProFormInstance>();

  return (
    <div className={styles.layout}>
      <StepsForm
        submitter={{
          render: (_, dom) => {
            if (_.step !== 0)
              return [
                <Button
                  key="pre"
                  onClick={() => {
                    _.onPre();
                  }}
                >
                  上一步
                </Button>,
                <Button
                  key="reload"
                  onClick={() => {
                    runFlow?.();
                  }}
                  type="primary"
                >
                  重新执行
                </Button>,
              ];
            return dom;
          },
        }}
      >
        <StepsForm.StepForm
          title={'选择工作流'}
          formRef={flowSelectFormRef}
          onFinish={async (values) => {
            const flowId = flowSelectFormRef.current?.getFieldValue('flowId');
            if (flowId) {
              Object.keys(values).forEach((key) => {
                if (key !== flowId && values[key] !== undefined) {
                  editor.updateNodeContent(key, 'text', values[key]);
                  editor.updateNodeContent(key, 'output', values[key]);
                }
              });
              runFlow?.();
              return true;
            }
          }}
        >
          <ProForm.Item
            rules={[
              {
                required: true,
                message: '请选择工作流',
              },
            ]}
            name="flowId"
            label="选择工作流"
          >
            <FlowSelect
              style={{
                width: '328px',
              }}
            />
          </ProForm.Item>

          <ProFormDependency name={['flowId']}>
            {({ flowId }) => {
              useFlowStore.setState({ activeId: flowId });
              if (!flowId) return null;
              return (
                <ProForm.Group title="必选输入">
                  <FlowInputRender flowId={flowId} />
                </ProForm.Group>
              );
            }}
          </ProFormDependency>
        </StepsForm.StepForm>

        <StepsForm.StepForm title={'模型执行'}>
          <div
            style={{
              padding: 24,
            }}
          >
            <FlowRunPanel />
          </div>
        </StepsForm.StepForm>
      </StepsForm>
    </div>
  );
};

const Runner: NextPage = () => {
  const [title] = useFlowStore((s) => [flowSelectors.currentFlowMeta(s).title], shallow);

  useEffect(() => {
    useSettings.persist.rehydrate();
    useSettings.setState({ sidebarKey: 'flow' });
  }, []);

  return (
    <FlowEditorProvider>
      <>
        <Head>
          <title>{title ? `正在执行 ${title} - DrawingBoard` : '节点运行 - DrawingBoard'}</title>
        </Head>
        <Flexbox id={'RunnerLayout'} horizontal width={'100%'} height={'100%'}>
          <Sidebar />
          <FlowStepForm />
        </Flexbox>
      </>
    </FlowEditorProvider>
  );
};

export default memo(Runner);
