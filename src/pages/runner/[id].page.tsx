import type { NextPage } from 'next';
import Head from 'next/head';
import { MutableRefObject, memo, useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';

import { FlowInputRender } from '@/components/FlowInputRender';
import { FlowRunPanel } from '@/components/FlowRunPanel';
import { flowSelectors, useFlowStore } from '@/store/flow';
import { ProForm, ProFormInstance, StepsForm } from '@ant-design/pro-components';
import { Button } from 'antd';
import { createStyles } from 'antd-style';
import { FlowEditorInstance, FlowStoreProvider } from 'kitchen-flow-editor';
import { useRouter } from 'next/router';
import React from 'react';
import RunnerLayout from './layout';

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
      padding-bottom: 80px;
    `,
  };
});

const FlowStepForm: React.FC<{
  flowId: string;
}> = (props) => {
  const [runFlow] = useFlowStore((s) => [s.runFlow], shallow);

  const editorRef = useRef<FlowEditorInstance>(
    null,
  ) as unknown as MutableRefObject<FlowEditorInstance>;

  const { styles } = useStyles();

  const flowSelectFormRef = React.useRef<ProFormInstance>();

  const [flow, dispatchFlow] = useFlowStore(
    (s) => [flowSelectors.currentFlowSafe(s), s.dispatchFlow],
    shallow,
  );

  const flowId = props.flowId;

  useEffect(() => {
    if (!editorRef.current) return;
    useFlowStore.setState({ editor: editorRef.current });
  }, [editorRef.current]);

  return (
    <FlowStoreProvider
      editorRef={editorRef}
      flattenNodes={flow.flattenNodes}
      flattenEdges={flow.flattenEdges}
      onFlattenEdgesChange={(flattenEdges) => {
        dispatchFlow({
          type: 'updateFlow',
          id: flowId,
          flow: { flattenEdges },
        });
      }}
      onFlattenNodesChange={(flattenNodes) => {
        dispatchFlow({ type: 'updateFlow', id: flowId, flow: { flattenNodes } });
      }}
    >
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
            title={'输入必选参数'}
            formRef={flowSelectFormRef}
            onFinish={async (values) => {
              const flowId = flowSelectFormRef.current?.getFieldValue('flowId');
              if (flowId) {
                Object.keys(values).forEach((key) => {
                  if (key !== flowId && values[key] !== undefined) {
                    editorRef.current?.updateNodeContent(key, 'text', values[key]);
                    editorRef.current?.updateNodeContent(key, 'output', values[key]);
                  }
                });
                runFlow?.();
                return true;
              }
            }}
          >
            <ProForm.Group title="必选输入">
              <FlowInputRender flowId={flowId} />
            </ProForm.Group>
          </StepsForm.StepForm>
          <StepsForm.StepForm title={'模型执行'}>
            <div
              style={{
                padding: 24,
                minWidth: 680,
                maxWidth: 680,
                width: '100%',
              }}
            >
              <FlowRunPanel />
            </div>
          </StepsForm.StepForm>
        </StepsForm>
      </div>
    </FlowStoreProvider>
  );
};

const Runner: NextPage = () => {
  const [title] = useFlowStore((s) => [flowSelectors.currentFlowMeta(s).title], shallow);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (typeof id === 'string') {
      useFlowStore.setState({ activeId: id });
    }
  }, [id]);

  useEffect(() => {
    return () => {
      useFlowStore.setState({ activeId: undefined });
    };
  }, []);

  return (
    <RunnerLayout>
      <Head>
        <title>{title ? `正在执行 ${title} - DrawingBoard` : '节点运行 - DrawingBoard'}</title>
      </Head>
      <FlowStepForm flowId={id as string} />
    </RunnerLayout>
  );
};

export default memo(Runner);
