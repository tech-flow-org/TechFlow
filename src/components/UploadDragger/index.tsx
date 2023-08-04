import { CloseCircleFilled } from '@ant-design/icons';
import { ProFormUploadDragger, ProFormUploadDraggerProps } from '@ant-design/pro-components';
import { Typography } from 'antd';
import { GlobalWorkerOptions, getDocument, version } from 'pdfjs-dist';

import { useState } from 'react';

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

const pdfToText = async (data: ArrayBuffer) => {
  const pdf = await getDocument(data).promise;
  return pdf.getPage(1).then(function (page: any) {
    return page.getTextContent().then(function (textContent: any) {
      return textContent.items
        .map(function (item: any) {
          return item.str;
        })
        .join(' ');
    });
  });
};

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
            top: 24,
            right: 8,
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
          const reader = new FileReader();
          reader.readAsArrayBuffer(file.file.originFileObj as File);
          reader.onloadend = async (e) => {
            const result = e.target?.result as ArrayBuffer;
            if (result) {
              const text = await pdfToText(new Uint8Array(result) as ArrayBuffer);
              props.onChange?.(text);
            }
          };
          return;
        }
        const reader = new FileReader();
        reader.readAsText(file.file.originFileObj as File);
        reader.onloadend = (e) => {
          props.onChange?.((e.target?.result as string).slice(0, 4096));
        };
      }}
    />
  );
};
