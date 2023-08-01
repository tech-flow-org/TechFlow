import { Divider, Form, Input, Segmented, Typography } from 'antd';
import { createStyles } from 'antd-style';

import { ALL_MODELS, useMaskStore } from '@/store/mask';
import { FooterToolbar, ProForm } from '@ant-design/pro-components';
import router from 'next/router';
import { AgentAvatar } from './AgentAvatar';

const useStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;
    max-width: 800px;
  `,
}));

export const AgentDetail = () => {
  const { styles } = useStyles();
  const maskStore = useMaskStore();

  const [form] = Form.useForm();
  return (
    <ProForm
      form={form}
      layout={'vertical'}
      className={styles.container}
      submitter={{
        render: (_, defaultDom) => {
          if (typeof window === 'undefined') return defaultDom;
          return <FooterToolbar>{defaultDom}</FooterToolbar>;
        },
      }}
      onFinish={async (values) => {
        const id = (await maskStore.getAll()).length + 1;
        maskStore.create({
          id,
          ...values,
          context: [
            {
              role: 'system',
              content: values.content,
              date: '',
            },
          ],
        });
        router.push('/mask');
      }}
    >
      <Form.Item name={'content'} label={'角色系统设定'}>
        <Input.TextArea style={{ minHeight: 200 }} />
      </Form.Item>
      <Form.Item name={'model'} label={'模型'}>
        <Segmented
          size={'large'}
          options={ALL_MODELS.map((item) => {
            return {
              label: item.name,
              value: item.name,
            };
          })}
        />
      </Form.Item>
      <Divider dashed>
        <Typography.Text type={'secondary'} style={{ fontWeight: 'normal' }}>
          角色元信息
        </Typography.Text>
      </Divider>
      <div
        style={{
          display: 'flex',
          gap: 32,
        }}
      >
        <Form.Item name={'avatar'}>
          <AgentAvatar />
        </Form.Item>
        <Form.Item
          name={'name'}
          style={{
            width: '400px',
          }}
          rules={[
            {
              required: true,
              message: '请输入角色名称',
            },
          ]}
          label={'角色名称'}
        >
          <Input size={'large'} placeholder={'给你的角色起一个名字，方便查找'} />
        </Form.Item>
      </div>
    </ProForm>
  );
};
