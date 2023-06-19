import {
  MessageOutlined,
  PartitionOutlined,
  PlusOutlined,
  SearchOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Button, Input, Segmented, Tooltip } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { useChatStore, useSessionStore } from '@/store';

import { SessionDisplayMode } from '@/store/session/initialState';

import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  top: css`
    position: sticky;
    top: 0;
  `,
}));

const Header = memo(() => {
  const { styles } = useStyles();

  const [mode, keywords, switchChat] = useSessionStore(
    (s) => [s.displayMode, s.keywords, s.switchChat],
    shallow,
  );

  const resetChat = useChatStore((s) => s.resetChat);

  return (
    <Flexbox gap={16} padding={'16px 8px 0'} className={styles.top}>
      <Flexbox horizontal gap={8}>
        <Input
          prefix={<SearchOutlined />}
          allowClear
          value={keywords}
          placeholder="搜索"
          style={{ borderColor: 'transparent' }}
          onChange={(e) => useSessionStore.setState({ keywords: e.target.value })}
        />
        <Tooltip arrow={false} title={'新对话'} placement={'right'}>
          <Button
            icon={<PlusOutlined />}
            style={{ minWidth: 32 }}
            onClick={() => {
              switchChat('new');
              resetChat();
            }}
          />
        </Tooltip>
      </Flexbox>
      <Segmented
        block
        value={mode}
        options={[
          { icon: <MessageOutlined />, label: '会话', value: 'chat' },
          { icon: <SmileOutlined />, label: '角色', value: 'agent' },
          { icon: <PartitionOutlined />, label: '聚合', value: 'tree' },
        ]}
        onChange={(v) => useSessionStore.setState({ displayMode: v as SessionDisplayMode })}
      />
    </Flexbox>
  );
});

export default Header;
