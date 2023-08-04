import { CloseCircleFilled } from '@ant-design/icons';
import { ProFormUploadDragger, ProFormUploadDraggerProps } from '@ant-design/pro-components';
import { Typography } from 'antd';
import { useState } from 'react';

export const UploadDragger = (
  props: ProFormUploadDraggerProps & {
    value?: string;
    onChange?: (value: string) => void;
  },
) => {
  const [fileType, setFileType] = useState<'txt' | 'csv' | 'json' | 'pdf'>();
  if (props.value && typeof props.value === 'string') {
    let value = props.value.trim();
    if (fileType === 'json') {
      value = JSON.stringify(JSON.parse(value), null, 2);
    }
    return (
      <div
        style={{
          height: 300,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <Typography.Paragraph>
          <pre>{value}</pre>
        </Typography.Paragraph>
        <CloseCircleFilled
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontSize: 16,
          }}
          onClick={() => props.onChange?.('')}
        />
      </div>
    );
  }
  return (
    <ProFormUploadDragger
      accept=".txt,.pdf,.csv,.ymal,.json"
      {...props}
      value={[]}
      onChange={(file) => {
        if (file.file.name.endsWith('.txt') || file.file.name.endsWith('.ymal')) {
          setFileType('txt');
        }
        if (file.file.name.endsWith('.json')) {
          setFileType('json');
        }
        if (file.file.name.endsWith('.csv')) {
          setFileType('csv');
        }
        if (file.file.name.endsWith('.pdf')) {
          setFileType('pdf');
          return;
        }
        const reader = new FileReader();
        reader.readAsText(file.file.originFileObj as File);
        reader.onloadend = (e) => {
          props.onChange?.(e.target?.result as string);
        };
      }}
    />
  );
};
