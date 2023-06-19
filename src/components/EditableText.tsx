import { ControlInput, ControlInputProps } from '@/components/ControlInput';
import { EditOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';

export const EditableText = ({ value, onChange }: ControlInputProps) => {
  const [edited, setEdited] = useState(false);
  return edited ? (
    <ControlInput
      value={value as string}
      onChangeEnd={() => {
        setEdited(false);
      }}
      onChange={onChange}
    />
  ) : (
    <Flexbox horizontal gap={8}>
      {value}
      <Tooltip title={'编辑'}>
        <EditOutlined
          onClick={() => {
            setEdited(!edited);
          }}
        />
      </Tooltip>
    </Flexbox>
  );
};
