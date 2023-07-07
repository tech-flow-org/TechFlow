import { Flexbox } from 'react-layout-kit';

import EmojiPicker from './EmojiPicker';

export const AgentAvatar: React.FC<Record<string, any>> = (props) => {
  return (
    <Flexbox horizontal gap={24}>
      <EmojiPicker {...props} />
    </Flexbox>
  );
};
