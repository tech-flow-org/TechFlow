import { flowSelectors, useFlowStore } from '@/store/flow';
import { Select, SelectProps } from 'antd';
import { isEqual } from 'lodash-es';

export const FlowSelect: React.FC<SelectProps> = (props) => {
  const list = useFlowStore(flowSelectors.flowMetaList, isEqual);
  return (
    <Select
      {...props}
      placeholder={'请选择工作流'}
      options={list.map((flow) => {
        return {
          label: flow.title,
          value: flow.id,
        };
      })}
    />
  );
};
