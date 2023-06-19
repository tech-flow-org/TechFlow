import isEqual from 'fast-deep-equal';

import Markdown from '@/components/Markdown';
import { flowSelectors, useFlowStore } from '@/store/flow';
import { StringTemplate } from '@/utils/StringTemplate';
import { CopyOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import { NodeField } from 'kitchen-flow-editor';

const Preview = () => {
  const [result] = useFlowStore((s) => {
    const flow = flowSelectors.currentFlowSafe(s);

    const variables = flowSelectors
      .getResultVariables(s)
      .filter((v) => v.nodeId)
      .map((v) => [v.name, flowSelectors.getSourceDataOfNode(v.nodeId!)(s)]);

    const template = new StringTemplate(flow.outputTemplate);
    const finalResult = template.render(Object.fromEntries(variables));
    return [finalResult];
  }, isEqual);

  return (
    <NodeField
      valueContainer={false}
      title={'结果预览'}
      id={'result'}
      extra={[
        {
          title: '复制',
          icon: <CopyOutlined />,
          onClick: () => {
            copy(result);
          },
        },
      ]}
      style={{ height: '100%', flex: 4 }}
    >
      <div style={{ overflowY: 'scroll', paddingBottom: 16 }}>
        <Markdown>{result}</Markdown>
      </div>
    </NodeField>
  );
};

export default Preview;
