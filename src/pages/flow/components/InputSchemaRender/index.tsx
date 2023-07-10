import Markdown from '@/components/Markdown';
import { flowSelectors, useFlowStore } from '@/store/flow';
import { Input, Segmented } from 'antd';
import { NodeField, useFlowEditor } from 'kitchen-flow-editor';
import { get, set } from 'rc-util';
import { memo, useCallback, useMemo } from 'react';
import { shallow } from 'zustand/shallow';
import { SymbolSchemaRenderMap } from '../nodes';
import SystemRole from './SystemRole';
import TaskPromptsInput from './TaskPromptsInput';
import { TextAreaInput } from './TextAreaInput';

const RenderComponent = memo(
  ({
    value,
    valueKey,
    component,
    title,
    options,
    id,
    onChange,
  }: {
    value: any;
    id: string;
    valueKey: string | string[];
    component: string;
    title: string;
    options?: any[];
    onChange: (key: string | string[], value: any) => void;
  }) => {
    if (component === 'Input') {
      return (
        <Input
          value={value}
          key={valueKey.toString()}
          className={'nowheel nodrag'}
          placeholder={'请输入' + title}
          onChange={(e) => {
            onChange(valueKey, e.target.value);
          }}
        />
      );
    }
    if (component === 'InputArea') {
      return (
        <TextAreaInput
          value={value}
          key={valueKey.toString()}
          placeholder={'请输入' + title}
          onChange={(value) => {
            onChange(valueKey, value);
          }}
        />
      );
    }
    if (component === 'Segmented') {
      return (
        <Segmented
          block
          value={value}
          key={valueKey.toString()}
          className={'nowheel nodrag'}
          options={options || []}
          placeholder={'请选择' + title}
          onChange={(e) => {
            onChange(valueKey, e);
          }}
        />
      );
    }
    if (component === 'SystemRole') {
      return (
        <SystemRole
          id={id}
          key={valueKey.toString()}
          valueKey={valueKey.toString()}
          title={title}
          value={value}
          onChange={(e) => {
            onChange(valueKey, e);
          }}
        />
      );
    }
    if (component === 'TaskPromptsInput') {
      return (
        <TaskPromptsInput
          valueKey={valueKey.toString()}
          id={id}
          key={valueKey.toString()}
          title={title}
          value={value}
          onChange={(e) => {
            onChange(valueKey, e);
          }}
        />
      );
    }
    return null;
  },
  shallow,
);

export const InputSchemaRender: React.FC<{
  id: string;
  type?: string;
  readonly?: boolean;
}> = (props) => {
  const editor = useFlowEditor();

  const [nodeData, nodeDataType] = useFlowStore((s) => {
    const node = flowSelectors.getNodeByIdSafe<Record<string, any>>(props.id)(s);
    return [node.data.content, node.type];
  }, shallow);

  const id = props.id;

  /**
   * 设置值
   * @param valueKey
   * @param newValue
   * @returns void
   */
  const setValue = useCallback((valueKey: string | string[], newValue: any) => {
    if (Array.isArray(valueKey) && valueKey.length > 1) {
      const updateValue = set(nodeData, valueKey, newValue);
      const newDataValue = get(updateValue, [valueKey.at(0) as string]);
      editor.updateNodeContent<Record<string, any>>(id, valueKey.at(0) as string, newDataValue);
      return;
    }
    editor.updateNodeContent<Record<string, any>>(id, valueKey?.toString(), newValue);
  }, []);

  const nodeType = useMemo(
    () => props.type || nodeDataType || 'string',
    [props.type, nodeDataType],
  );

  const schema = useMemo(() => Object.keys(SymbolSchemaRenderMap[nodeType]), [nodeDataType]);

  return schema.map((key) => {
    const item = SymbolSchemaRenderMap[nodeType][key];
    const component = item.component;
    const valueKey = item.valueKey || key;
    const value = get(nodeData, [valueKey].flat(1));
    // 如果是只读模式直接返回  markdown
    if (props.readonly)
      return (
        <NodeField
          key={key}
          id={key}
          title={item.title}
          handles={item.handles}
          valueContainer={item.valueContainer === false && !props.readonly ? false : true}
        >
          {value ? (
            <Markdown key={valueKey.toString()}>{value}</Markdown>
          ) : (
            <span key={valueKey.toString()}>请输入</span>
          )}
        </NodeField>
      );

    if (item.hideContainer && !props.readonly)
      return (
        component && (
          <RenderComponent
            component={component}
            title={item.title}
            options={item.options}
            value={value}
            valueKey={valueKey}
            onChange={setValue}
            id={id}
            key={valueKey.toString()}
          />
        )
      );
    return (
      <NodeField
        key={key}
        id={key}
        title={item.title}
        handles={item.handles}
        valueContainer={item.valueContainer === false && !props.readonly ? false : true}
      >
        {component && (
          <RenderComponent
            id={id}
            onChange={setValue}
            component={component}
            title={item.title}
            options={item.options}
            value={value}
            valueKey={valueKey}
            key={valueKey.toString()}
          />
        )}
      </NodeField>
    );
  });
};
