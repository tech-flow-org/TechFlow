import isEqual from 'fast-deep-equal';
import { BasicNode, NodeField } from 'kitchen-flow-editor';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Markdown from '@/components/Markdown';
import { agentSelectors, useSessionStore } from '@/store';

const AITask = memo<{ id: string }>(({ id }) => {
  const [title, content, model] = useSessionStore((s) => {
    const agent = agentSelectors.getAgentById(id)(s);

    return [agent.title, agent.content, agent.model];
  }, isEqual);

  return (
    <BasicNode.Preview title={title}>
      <Flexbox gap={24}>
        <NodeField id={'model'} title={'模型'}>
          {model}
        </NodeField>
        <NodeField id={'prompt'} title={'提示词输入'}>
          <Markdown>{content}</Markdown>
        </NodeField>
      </Flexbox>
    </BasicNode.Preview>
  );
});

export default AITask;
