import { LoadingOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Typography } from 'antd';
import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import { useSessionStore } from '@/store';
import { agentSelectors } from '@/store/session/selectors';
import { AgentAvatar } from './AgentAvatar';

const useStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;
    max-width: 800px;
  `,
}));

export const AgentDetail = () => {
  const { styles } = useStyles();

  const [autoAddAgentName, autoNamingAgent, dispatchAgent] = useSessionStore(
    (s) => [s.autoAddAgentName, s.addingAgentName, s.dispatchAgent],
    shallow,
  );
  const agent = useSessionStore(agentSelectors.currentAgent, isEqual);

  const { title, content, id: agentId, avatarBackground } = agent;

  const [form] = Form.useForm();
  useEffect(() => {
    if (!agent.id) {
      // 说明是新角色
      form.resetFields();
    }
    if (!agent.content) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash: _, id: __, content, title, description, model } = agent;

    form.setFieldsValue({
      content,
      title: title || '',
      description,
      model,
    });
  }, [agent]);

  return (
    <Form
      form={form}
      layout={'vertical'}
      className={styles.container}
      initialValues={{ title, content }}
      onValuesChange={(changedValues) => {
        const [key, value] = Object.entries(changedValues)[0];

        dispatchAgent({
          id: agentId,
          type: 'updateAgentData',
          key: key as any,
          value: value as any,
        });
      }}
    >
      <Form.Item name={'content'} label={'角色系统设定'}>
        <Input.TextArea style={{ minHeight: 200 }} />
      </Form.Item>
      {/*<Form.Item name={'model'} label={'模型'}>*/}
      {/*  <Segmented*/}
      {/*    size={'large'}*/}
      {/*    options={[*/}
      {/*      {*/}
      {/*        value: 'gpt-3.5-turbo',*/}
      {/*        label: 'GPT-3.5',*/}
      {/*      },*/}
      {/*      // {*/}
      {/*      //   value: 'chatglm-6b',*/}
      {/*      //   label: 'ChatGLM-6B',*/}
      {/*      //   disabled: true,*/}
      {/*      // },*/}
      {/*    ]}*/}
      {/*  />*/}
      {/*</Form.Item>*/}
      <Divider dashed>
        <Typography.Text type={'secondary'} style={{ fontWeight: 'normal' }}>
          角色元信息
        </Typography.Text>
      </Divider>
      <Form.Item name={'avatar'} label={'头像'}>
        <AgentAvatar id={agentId} background={avatarBackground} />
      </Form.Item>
      <Form.Item name={'title'} label={'角色名称'}>
        <Input
          size={'large'}
          placeholder={'给你的角色起一个名字，方便查找'}
          suffix={
            autoNamingAgent ? (
              <LoadingOutlined />
            ) : (
              <Button type={'link'} size={'small'} onClick={() => autoAddAgentName(agentId)}>
                自动起名
              </Button>
            )
          }
        />
      </Form.Item>
    </Form>
  );
};
