import { ProFormUploadDragger, ProFormUploadDraggerProps } from '@ant-design/pro-components';
import { Typography } from 'antd';

export const UploadDragger = (
  props: ProFormUploadDraggerProps & {
    value?: string;
    onChange?: (value: string) => void;
  },
) => {
  if (props.value && typeof props.value === 'string') {
    return (
      <div
        style={{
          height: 300,
          overflow: 'auto',
        }}
      >
        <Typography.Paragraph>
          <pre>{props.value?.trim()}</pre>
        </Typography.Paragraph>
      </div>
    );
  }
  return (
    <ProFormUploadDragger
      {...props}
      value={[]}
      onChange={(file) => {
        const reader = new FileReader();
        reader.readAsText(file.file.originFileObj as File);
        reader.onloadend = (e) => {
          props.onChange?.(e.target?.result as string);
        };
      }}
    />
  );
};
