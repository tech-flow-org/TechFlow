import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { useSessionStore } from '@/store';

import AgentItem from './AgentItem';

import { agentSelectors } from '@/store/session/selectors';
import { Button } from 'antd';
import { createStyles } from 'antd-style';
import { rgba } from 'polished';

const MagicWandOutlined = () => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.02 3.635l12.518 12.518a1.863 1.863 0 010 2.635l-1.317 1.318a1.863 1.863 0 01-2.635 0L3.068 7.588A2.795 2.795 0 117.02 3.635zm2.09 14.428a.932.932 0 110 1.864.932.932 0 010-1.864zm-.043-9.747L7.75 9.635l9.154 9.153 1.318-1.317-9.154-9.155zM3.52 12.473c.514 0 .931.417.931.931v.932h.932a.932.932 0 110 1.864h-.932v.931a.932.932 0 01-1.863 0l-.001-.931h-.93a.932.932 0 010-1.864h.93v-.932c0-.514.418-.931.933-.931zm15.374-3.727a1.398 1.398 0 110 2.795 1.398 1.398 0 010-2.795zM4.385 4.953a.932.932 0 000 1.317l2.046 2.047L7.75 7 5.703 4.953a.932.932 0 00-1.318 0zM14.701.36a.932.932 0 01.931.932v.931h.932a.932.932 0 010 1.864h-.933l.001.932a.932.932 0 11-1.863 0l-.001-.932h-.93a.932.932 0 110-1.864h.93v-.931a.932.932 0 01.933-.932z"></path>
    </svg>
  );
};

export const useStyles = createStyles(({ css, token }) => ({
  button: css`
    position: sticky;
    z-index: 30;
    bottom: 0;

    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;

    margin-top: 8px;
    padding: 12px 12px;

    background: ${rgba(token.colorBgLayout, 0.5)};
    backdrop-filter: blur(8px);
  `,
}));

export const AgentList = memo(() => {
  const [list, activeId, loading, autocompleteAgentMetaInfo] = useSessionStore(
    (s) => [
      agentSelectors.agentList(s),
      s.activeId,
      s.addingAgentName,
      s.autocompleteAgentMetaInfo,
    ],
    shallow,
  );

  const { styles } = useStyles();
  return (
    <>
      {list.map(({ id }) => (
        <Flexbox key={id} gap={4} paddingBlock={4}>
          <AgentItem
            active={activeId === id}
            key={id}
            id={id}
            simple={false}
            loading={loading && id === activeId}
          />
        </Flexbox>
      ))}
      {list.length === 0 ? null : (
        <Flexbox padding={8} paddingBlock={12} className={styles.button}>
          <Button
            block
            icon={<MagicWandOutlined />}
            onClick={() => {
              list.forEach((a) => {
                autocompleteAgentMetaInfo(a.id);
              });
            }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            一键美化
          </Button>
        </Flexbox>
      )}
    </>
  );
});
