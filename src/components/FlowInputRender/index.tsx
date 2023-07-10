import { useFlowStore } from '@/store/flow';
import { ProFormText } from '@ant-design/pro-components';
import { isEqual } from 'lodash-es';
import { memo } from 'react';

export const FlowInputRender: React.FC<{
  flowId: string;
}> = memo((props) => {
  const [flattenNodes] = useFlowStore((s) => {
    const flow = s.flows[props.flowId];
    return [flow?.flattenNodes || {}];
  }, isEqual);

  const inputNodes = Object.values(flattenNodes || {}).filter((n) => n.type === 'string');
  return (
    <>
      {inputNodes.map((node) => {
        return (
          <ProFormText
            width={'md'}
            initialValue={node.data.content.text}
            key={node.id}
            rules={[
              {
                required: true,
                message: '请输入' + node.data.meta.title,
              },
            ]}
            name={node.id}
            label={node.data.meta.title}
          />
        );
      })}
    </>
  );
});
