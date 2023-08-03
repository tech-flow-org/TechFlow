import { jsonToSchema } from '@/utils/jsonToSchema';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-components';
import { Editor } from '@monaco-editor/react';
import { Button, Space, message } from 'antd';
import type { NextPage } from 'next';
import { memo, useState } from 'react';
import { SchemaLayout } from './layout';

const defaultJson = {
  model: 'chilloutmix_NiPrunedFp32Fix',
  width: 512,
  height: 512,
  hr_scale: 2,
  prompt: '{input}',
  enable_hr: true,
  negative_prompt:
    'EasyNegative, NSFW, 2faces, 4eyes, 3arms, 4arms, 3legs, 4legs, hand, foot, naked, penis, pussy, sex, porn, 1gril, 1boy, human, logo, text, watermark ',
};

const Schema: NextPage = () => {
  const [jsonSchema, setJsonSchema] = useState<Record<string, any>>(() =>
    jsonToSchema(defaultJson, { required: false }),
  );
  return (
    <SchemaLayout>
      <Space
        style={{
          margin: '8px',
        }}
      >
        <ModalForm
          title="从 JSON  导入"
          onFinish={async (values) => {
            try {
              setJsonSchema(
                jsonToSchema(JSON.parse(values.json), {
                  required: false,
                }),
              );
              return true;
            } catch (error) {
              console.log(values.json);
              message.error('JSON 格式错误');
              return false;
            }
          }}
          initialValues={{
            json: JSON.stringify(defaultJson, null, 2),
          }}
          trigger={<Button type="primary">从 json 导入</Button>}
        >
          <ProFormTextArea
            name="json"
            label="JSON 内容"
            fieldProps={{
              rows: 10,
            }}
          />
        </ModalForm>
      </Space>
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
        }}
      >
        <div
          style={{
            flex: 1,
          }}
        >
          <Editor
            language="json"
            value={JSON.stringify(jsonSchema, null, 2)}
            onChange={(changeValue) => {
              try {
                setJsonSchema(JSON.parse(changeValue || '{}'));
              } catch (error) {
                // message.error('JSON 格式错误');
              }
            }}
            options={{
              minimap: {
                enabled: false,
              },
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
          }}
        ></div>
      </div>
    </SchemaLayout>
  );
};

export default memo(Schema);
