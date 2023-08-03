import { jsonToSchema } from '@/utils/jsonToSchema';
import { Editor } from '@monaco-editor/react';
import type { NextPage } from 'next';
import { memo } from 'react';
import { SchemaLayout } from './layout';

const Schema: NextPage = () => {
  const json = {
    model: 'chilloutmix_NiPrunedFp32Fix',
    width: 512,
    height: 512,
    hr_scale: 2,
    prompt: '{input}',
  };
  return (
    <SchemaLayout>
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
          <Editor language="json" defaultValue={JSON.stringify(json, null, 2)} />
        </div>
        <div
          style={{
            flex: 1,
          }}
        >
          <Editor
            language="json"
            defaultValue={JSON.stringify(jsonToSchema(json, { required: false }), null, 2)}
          />
        </div>
      </div>
    </SchemaLayout>
  );
};

export default memo(Schema);
