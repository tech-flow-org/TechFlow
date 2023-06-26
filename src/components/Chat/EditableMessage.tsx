import { MessageModal } from '@/components/Chat/index';
import Markdown from '@/components/Markdown';
import MessageInput from '@/components/MessageInput';
import { memo } from 'react';
import useControlledState from 'use-merge-value';

interface EditableMessageProps {
  /**
   * @title 当前文本值
   */
  value: string;
  /**
   * @title 值改变时的回调函数
   * @param value - 改变后的值
   */
  onChange: (value: string) => void;
  /**
   * @title 是否打开模态框
   * @default false
   */
  openModal?: boolean;
  /**
   * @title 模态框打开状态变化的回调函数
   * @param open - 模态框是否打开
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * @title 是否处于编辑状态
   * @default false
   */
  editing?: boolean;
  /**
   * @title 编辑状态变化的回调函数
   * @param editing - 是否处于编辑状态
   */
  onEditingChange?: (editing: boolean) => void;
  /**
   * @title 当文本值为空时是否显示编辑按钮
   * @default false
   */
  showEditWhenEmpty?: boolean;
  classNames?: {
    markdown?: string;
    input?: string;
  };
  placeholder?: string;
}

export const EditableMessage = memo<EditableMessageProps>(
  ({
    value,
    onChange,
    classNames = {},
    onEditingChange,
    editing,
    openModal,
    onOpenChange,
    placeholder,
    showEditWhenEmpty = false,
  }) => {
    const [isEdit, setTyping] = useControlledState(false, {
      value: editing,
      onChange: onEditingChange,
    });

    const [expand, setExpand] = useControlledState<boolean>(false, {
      value: openModal,
      onChange: onOpenChange,
    });

    return !value && showEditWhenEmpty ? (
      <MessageInput
        placeholder={placeholder}
        onConfirm={(text) => {
          onChange?.(text);
          setTyping(false);
        }}
        className={classNames.input}
      />
    ) : (
      <>
        <MessageModal
          open={expand}
          onOpenChange={setExpand}
          value={value}
          editing={isEdit}
          onEditingChange={setTyping}
          onChange={(text) => {
            onChange?.(text);
          }}
        />
        {!expand && isEdit ? (
          <MessageInput
            placeholder={placeholder}
            onConfirm={(text) => {
              onChange?.(text);
              setTyping(false);
            }}
            onCancel={() => setTyping(false)}
            defaultValue={value}
            className={classNames.input}
          />
        ) : (
          <Markdown className={classNames.markdown}>{value}</Markdown>
        )}
      </>
    );
  },
);
