import { EditableMessage } from '@/components/Chat';
import { IconAction } from '@/components/IconAction';
import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import { TextVariableHandle } from './TextVariableHandle';

export const TextAreaInput: React.FC<{
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}> = (props) => {
  const [isEdit, setTyping] = useState(false);
  const [expand, setExpand] = useState(false);
  return (
    <Flexbox className={'nodrag'}>
      <TextVariableHandle handleId={'task'} chatMessages={[props.value || '']} />
      {isEdit ? (
        <EditableMessage
          showEditWhenEmpty
          openModal={expand}
          placeholder={props.placeholder}
          onOpenChange={setExpand}
          value={props.value}
          editing={isEdit}
          onEditingChange={setTyping}
          onChange={(text) => {
            props.onChange(text);
          }}
        />
      ) : (
        <Flexbox style={{ width: '100%' }} direction="horizontal">
          <div
            style={{
              flex: 1,
            }}
          >
            {props.value}
          </div>
          <IconAction
            title="编辑"
            icon={<EditOutlined />}
            onClick={() => {
              setTyping(true);
            }}
          />
        </Flexbox>
      )}
    </Flexbox>
  );
};
