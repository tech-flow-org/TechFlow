import { getInputVariablesFromMessages } from '@/helpers/prompt';
import { ChatMessage } from '@/types';
import { useNodeFieldStyles } from '@ant-design/pro-flow-editor';
import { Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { Handle, Position } from 'reactflow';

const useStyles = createStyles(({ css }) => ({
  handleContainer: css`
    position: absolute;
    left: -12px;
    padding-top: 8px;
  `,
  segment: css`
    font-weight: normal;
  `,
  handle: css`
    position: relative;
    top: 0;
    left: 0;
    transform: none;
  `,
}));

interface VariableHandleProps {
  chatMessages: ChatMessage[];
  handleId: string;
}
export const VariableHandle = memo<VariableHandleProps>(({ handleId, chatMessages = [] }) => {
  const { styles, cx } = useStyles();
  const { styles: fieldStyles } = useNodeFieldStyles();

  const inputVariables = getInputVariablesFromMessages(chatMessages);

  return (
    <Flexbox gap={16} className={styles.handleContainer}>
      {inputVariables
        .filter((i) => !i.includes(' '))
        .map(
          (i, index) =>
            i && (
              <Tooltip key={index + i} title={i}>
                <Handle
                  id={`${handleId},${i}`}
                  type={'target'}
                  position={Position.Left}
                  className={cx(fieldStyles.handle, styles.handle)}
                />
              </Tooltip>
            ),
        )}
    </Flexbox>
  );
}, isEqual);
