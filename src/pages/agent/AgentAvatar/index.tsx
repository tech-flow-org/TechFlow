import {
  blue,
  cyan,
  geekblue,
  gold,
  green,
  lime,
  magenta,
  orange,
  purple,
  red,
  volcano,
  yellow,
} from '@ant-design/colors';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { Flexbox } from 'react-layout-kit';

import { Swatches } from '@/components/Swatches';
import { useSessionStore } from '@/store';
import { createUploadImageHandler } from '@/utils/uploadFIle';
import { shallow } from 'zustand/shallow';
import EmojiPicker from './EmojiPicker';

const STEP = 4;

export const AgentAvatar = ({ id, background }: { id: string; background?: string }) => {
  const [dispatchAgent, autoPickEmoji] = useSessionStore(
    (s) => [s.dispatchAgent, s.autoPickEmoji],
    shallow,
  );

  const onUpload = createUploadImageHandler((avatar) => {
    dispatchAgent({ type: 'updateAgentData', id, value: avatar, key: 'avatar' });
  });

  return (
    <Flexbox horizontal gap={24}>
      <EmojiPicker />
      <Flexbox align={'flex-start'} gap={12}>
        <Upload itemRender={() => null} maxCount={1} beforeUpload={onUpload}>
          <Button icon={<UploadOutlined />}>上传图片</Button>
        </Upload>
        <Flexbox horizontal align={'center'} gap={12}>
          <Swatches
            activeColor={background}
            colors={[
              red[STEP],
              orange[STEP],
              gold[STEP],
              yellow[STEP],
              lime[STEP],
              green[STEP],
              cyan[STEP],
              blue[STEP],
              geekblue[STEP],
              purple[STEP],
              magenta[STEP],
              volcano[STEP],
            ]}
            onSelect={(value) => {
              dispatchAgent({
                type: 'updateAgentData',
                id,
                value: value as any,
                key: 'avatarBackground',
              });
            }}
          />
          <Button
            type={'link'}
            onClick={() => {
              autoPickEmoji(id);
            }}
          >
            自动搭配
          </Button>
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
};
