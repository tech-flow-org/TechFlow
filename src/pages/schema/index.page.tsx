import { jsonToSchema } from '@/utils/jsonToSchema';
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Editor } from '@monaco-editor/react';
import { Button, Modal, Space, message } from 'antd';
import { useTheme } from 'antd-style';
import type { NextPage } from 'next';
import { memo, useState } from 'react';
import { SchemaLayout } from './layout';

const JSON_SCHEMA = {
  $id: 'https://example.com/address.schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
};

const defaultJson = {
  model: 'chilloutmix_NiPrunedFp32Fix',
  width: 512,
  height: 512,
  hr_scale: 2,
  prompt: '{input}',
  enable_hr: true,
  negative_prompt: [
    'EasyNegative',
    'NSFW',
    '2faces',
    '4eyes',
    '3arms',
    '4arms',
    '3legs',
    '4legs',
    'hand',
    'foot',
    'naked',
    'penis',
    'pussy',
    'sex',
    'porn',
    '1gril',
    '1boy',
    'human',
    'logo',
    'text',
    'watermark',
  ],
};

const PropertiesRender: React.FC<{
  properties: Record<string, any>;
}> = (props) => {
  const properties = props.properties;
  const keys = Object.keys(properties);

  return (
    <ProForm
      onFinish={async (values) => {
        Modal.success({
          title: '生成的数据',
          content: (
            <pre>
              <code>{JSON.stringify(values, null, 2)}</code>
            </pre>
          ),
        });
      }}
    >
      {keys.map((key) => {
        const property = properties[key];
        if (property.type === 'array' || property?.items?.enum) {
          return (
            <ProFormSelect
              width="md"
              label={property.title || key}
              name={key}
              key={key}
              fieldProps={{
                options: property?.items?.enum || [],
              }}
            />
          );
        }
        if (property.type === 'string') {
          return <ProFormText width="md" label={property.title || key} name={key} key={key} />;
        }
        if (property.type === 'integer') {
          return <ProFormDigit width="md" label={property.title || key} name={key} key={key} />;
        }
        if (property.type === 'boolean') {
          return <ProFormSwitch width="md" label={property.title || key} name={key} key={key} />;
        }
        return <ProFormText width="md" label={property.title || key} name={key} key={key} />;
      })}
    </ProForm>
  );
};

const Schema: NextPage = () => {
  const [jsonSchema, setJsonSchema] = useState<Record<string, any>>(() => ({
    type: 'object',
    ...JSON_SCHEMA,
    properties: {
      model: {
        title: '模型',
        type: 'string',
      },
      width: {
        type: 'integer',
      },
      height: {
        type: 'integer',
      },
      hr_scale: {
        type: 'integer',
      },
      prompt: {
        type: 'string',
      },
      enable_hr: {
        type: 'boolean',
      },
      negative_prompt: {
        type: 'array',
        items: {
          type: 'string',
          enum: [
            'EasyNegative',
            'NSFW',
            '2faces',
            '4eyes',
            '3arms',
            '4arms',
            '3legs',
            '4legs',
            'hand',
            'foot',
            'naked',
            'penis',
            'pussy',
            'sex',
            'porn',
            '1gril',
            '1boy',
            'human',
            'logo',
            'text',
            'watermark',
          ],
        },
      },
    },
  }));
  const theme = useTheme();

  return (
    <SchemaLayout>
      <div
        style={{
          borderBottom: `1px solid ${theme.colorBorderDivider}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px',
        }}
      >
        <div
          style={{
            fontSize: theme.fontSizeHeading5,
            color: theme.colorTextHeading,
          }}
        >
          修改 Schema
        </div>
        <Space>
          <ModalForm
            title="从 JSON  导入"
            onFinish={async (values) => {
              try {
                setJsonSchema(
                  jsonToSchema(JSON.parse({ ...values.json, ...JSON_SCHEMA }), {
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
            trigger={<Button>从 json 导入</Button>}
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
      </div>
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          maxHeight: 'calc(100vh - 54px)',
        }}
      >
        <div
          style={{
            flex: 1,
            overflow: 'auto',
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
            padding: '12px 24px',
            overflow: 'auto',
          }}
        >
          <PropertiesRender properties={jsonSchema.properties} />
        </div>
      </div>
    </SchemaLayout>
  );
};

export default memo(Schema);
