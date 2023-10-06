import {
  ClearOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  SettingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormDependency,
  ProFormSegmented,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Dropdown, FormInstance } from 'antd';
import { useTheme } from 'antd-style';
import { memo, useRef } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import AgentAvatar from '@/components/AgentAvatar';
import { ControlInput } from '@/components/ControlInput';
import { UploadDragger } from '@/components/UploadDragger';
import { hasFlowRunner } from '@/helpers/flow';
import { flowSelectors, useFlowStore } from '@/store/flow';
import { useSession } from 'next-auth/react';

const Header = memo(() => {
  const [openImportFlowModal, closeImportFlowModal, exportWorkflow, importFlow, saveFlowToServer] =
    useFlowStore(
      (s) => [
        s.openImportFlowModal,
        s.closeImportFlowModal,
        s.exportWorkflow,
        s.importFlow,
        s.saveFlowToServer,
      ],
      shallow,
    );

  const session = useSession();

  const formRef = useRef<FormInstance>();

  const [
    id,
    title,
    avatar,
    importModalOpen,
    isTaskEmpty,
    runningTask,
    runFlow,
    dispatchFlow,
    cancelFlowNode,
  ] = useFlowStore((s) => {
    const flow = flowSelectors.currentFlowSafe(s);
    const meta = flowSelectors.currentFlowMeta(s);
    return [
      flow.id,
      meta.title,
      meta.avatar,
      flow.state.importModalOpen,
      !hasFlowRunner(flow.flattenEdges),
      flow.state.runningTask,
      s.runFlow,
      s.dispatchFlow,
      s.cancelFlowNode,
    ];
  }, shallow);

  const theme = useTheme();

  return (
    <Flexbox
      horizontal
      align={'center'}
      distribution={'space-between'}
      padding={8}
      paddingInline={16}
      style={{
        borderBottom: `1px solid ${theme.colorBorderDivider}`,
        gridArea: 'header',
      }}
    >
      <Flexbox horizontal align={'center'}>
        <AgentAvatar size={32} avatar={avatar} title={title} />
        <ControlInput
          bordered={false}
          value={title}
          onChange={(e) => {
            dispatchFlow({
              type: 'updateFlowMeta',
              id,
              meta: { title: e },
            });
          }}
        />
      </Flexbox>
      <Flexbox direction="horizontal" gap={8}>
        {session.data?.user ? (
          <Button
            icon={<SaveOutlined />}
            type="primary"
            onClick={() => {
              saveFlowToServer();
            }}
          >
            保存
          </Button>
        ) : null}

        <Button
          disabled={isTaskEmpty}
          loading={runningTask}
          onClick={runFlow}
          icon={<PlayCircleOutlined />}
        >
          {runningTask ? '运行中' : '运行'}
        </Button>

        {runningTask ? (
          <Button
            danger
            onClick={() => {
              cancelFlowNode();
            }}
          >
            结束运行
          </Button>
        ) : null}
        <Dropdown
          menu={{
            items: [
              {
                label: '导入 workflow',
                icon: <UploadOutlined />,
                key: 'import',
                onClick: () => {
                  openImportFlowModal(id);
                },
              },
              {
                key: 'export',
                label: '导出 workflow',
                icon: <DownloadOutlined />,
                onClick: () => {
                  exportWorkflow();
                },
              },
            ],
          }}
        >
          <Button
            style={{
              border: '1px solid #DDD',
            }}
            icon={<SettingOutlined />}
          >
            操作
          </Button>
        </Dropdown>
      </Flexbox>

      <ModalForm
        onOpenChange={(open) => {
          if (!open) {
            closeImportFlowModal(id);
          }
        }}
        formRef={formRef}
        title="导入文件"
        initialValues={{
          method: 'text',
        }}
        open={importModalOpen}
        onFinish={async (value) => {
          return importFlow(id, value.file);
        }}
      >
        <ProFormSegmented
          name="method"
          label="导入方式"
          request={async () => {
            return [
              {
                label: '文本输入',
                value: 'text',
              },
              {
                label: '文件',
                value: 'file',
              },
            ];
          }}
        />
        <ProFormDependency name={['method']}>
          {({ method }) => {
            if (method === 'text') return <ProFormTextArea name="file" label="yaml 文本" />;
            if (method === 'file')
              return (
                <ProForm.Item
                  name="file"
                  label={
                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        alignItems: 'center',
                      }}
                    >
                      <span>yaml 文本</span>
                      <Button
                        icon={<ClearOutlined />}
                        onClick={() => {
                          formRef.current?.setFieldsValue({
                            file: '',
                          });
                        }}
                      />
                    </div>
                  }
                >
                  <UploadDragger />
                </ProForm.Item>
              );
            return null;
          }}
        </ProFormDependency>
      </ModalForm>
    </Flexbox>
  );
});

export default Header;
