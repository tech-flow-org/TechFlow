import { LoadingOutlined, RobotOutlined } from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProFormItem,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormInstance, Segmented, Space, message } from 'antd';
import dayjs from 'dayjs';
import type { NextPage } from 'next';
import { memo, useRef, useState } from 'react';

const utf8Decoder = new TextDecoder('utf-8');

const GitHubIssue: NextPage = () => {
  const [row, setRow] = useState<
    | {
        id: string;
        title: string;
        body: string;
      }
    | undefined
  >();
  const formRef = useRef<FormInstance>();
  const [loading, setLoading] = useState(false);
  const [repo, setRepo] = useState<'ant-design' | 'pro-components'>('pro-components');
  return (
    <PageContainer
      title="issue 解答"
      extra={
        <Segmented
          value={repo}
          onChange={(e) => {
            setRepo(e as 'ant-design');
          }}
          options={[
            {
              label: 'Ant Design',
              value: 'ant-design',
            },
            {
              label: 'ProComponents',
              value: 'pro-components',
            },
            {
              label: 'Ant Design Pro',
              value: 'ant-design-pro',
            },
          ]}
        />
      }
    >
      <div
        style={{
          width: '100%',
          height: 'calc(100vh - 64px)',
        }}
      >
        <ModalForm
          key={row?.id}
          formRef={formRef}
          title={'AI 解答：' + (row?.title ?? '未选择')}
          open={!!row}
          request={async () => {
            return {
              ...row,
              title: row?.title,
              body: undefined,
            };
          }}
          onOpenChange={(open) => {
            if (open) return;
            setRow(undefined);
          }}
          onFinish={(values) => {
            return fetch('/api/github', {
              method: 'POST',
              body: JSON.stringify({
                ...values,
                id: row?.id,
                owner: 'ant-design',
                repo,
              }),
            }).then((msg) => {
              if (msg) {
                message.success('提交成功');
                return true;
              }
              message.error('提交失败');
            });
          }}
        >
          <ProFormItem label="🆔">
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://github.com/ant-design/${repo}/issues/` + row?.id}
            >
              #{row?.id}
            </a>
          </ProFormItem>
          <ProFormTextArea
            label="问题"
            name="title"
            fieldProps={{
              rows: 3,
            }}
          />
          <ProFormTextArea
            label={
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                }}
              >
                <span>答案</span>
                <a
                  style={{
                    display: 'flex',
                    gap: 4,
                  }}
                  onClick={() => {
                    setLoading(true);
                    fetch('/api/docantd', {
                      method: 'POST',
                      body: JSON.stringify({
                        title: formRef.current?.getFieldValue('title'),
                        id: row?.id,
                        body: row?.body,
                        owner: 'ant-design',
                        repo,
                      }),
                    }).then((response) => {
                      const reader = response?.body?.getReader();
                      let responseText = '';
                      return reader
                        ?.read()
                        .then(async function process({ done, value: chunk }): Promise<any> {
                          if (done) {
                            setLoading(false);
                            return;
                          }
                          responseText = responseText + utf8Decoder.decode(chunk, { stream: true });
                          formRef.current?.setFieldsValue({
                            body: responseText,
                          });
                          return reader.read().then(process);
                        });
                    });
                  }}
                >
                  {loading ? <LoadingOutlined /> : <RobotOutlined />}
                  机器人解答
                </a>
              </div>
            }
            name="body"
            fieldProps={{
              rows: 10,
            }}
            placeholder="点击标题旁的 机器人解答 开始解答"
          />
        </ModalForm>
        <ProTable<{
          id: string;
          title: string;
          body: string;
          labels: string[];
        }>
          params={{
            repo,
          }}
          columns={[
            {
              title: 'id',
              dataIndex: 'id',
              key: 'id',
              search: false,
              width: 100,
              render: (dom, row) => {
                return (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://github.com/ant-design/${repo}/issues/` + row.id}
                  >
                    #{row.id}
                  </a>
                );
              },
            },
            {
              title: '标题',
              dataIndex: 'title',
              key: 'title',
              ellipsis: true,
            },
            {
              title: '标签',
              dataIndex: 'labels',
              key: 'labels',
              render: (dom, row) => {
                return (
                  <Space>
                    {row.labels.map((label) => {
                      return <a key={label}>{label}</a>;
                    })}
                  </Space>
                );
              },
            },
            {
              title: '更新时间',
              dataIndex: 'updateTime',
              key: 'updateTime',
              valueType: 'dateTime',
              renderText: (text) => (text ? dayjs(text) : undefined),
            },
            {
              width: 200,
              title: 'action',
              dataIndex: 'action',
              key: 'action',
              valueType: 'option',
              render: (dom, row) => [
                <a
                  key="link"
                  onClick={() => {
                    if (!row) return;
                    setRow(row);
                  }}
                >
                  AI 进行解答
                </a>,
              ],
            },
          ]}
          request={(params) => {
            return fetch(
              `/api/github?owner=ant-design&repo=${repo}&page=${params.current}&pageSize=${params.pageSize}`,
              {
                method: 'GET',
              },
            )
              .then((res) => res.json())
              .then((res) => {
                return {
                  data: res,
                };
              });
          }}
        />
      </div>
    </PageContainer>
  );
};

export default memo(GitHubIssue);
