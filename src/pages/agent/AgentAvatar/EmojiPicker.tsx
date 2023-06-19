import AgentAvatar from '@/components/AgentAvatar';
import { useSessionStore } from '@/store';
import { agentSelectors } from '@/store/session/selectors';
import data from '@emoji-mart/data';
import i18n from '@emoji-mart/data/i18n/zh.json';
import Picker from '@emoji-mart/react';
import { Popover } from 'antd';
import { createStyles } from 'antd-style';
import chroma from 'chroma-js';
import isEqual from 'fast-deep-equal';

const useStyles = createStyles(({ css, token, prefixCls }) => ({
  popover: css`
    .${prefixCls}-popover-inner {
      padding: 0;
    }
  `,
  picker: css`
    em-emoji-picker {
      --rgb-accent: ${chroma(token.colorPrimary).rgb().join(',')};
      --shadow: none;
    }
  `,
}));

const EmojiPicker = () => {
  const { styles } = useStyles();
  const [avatar, title, id, avatarBackground, dispatchAgent] = useSessionStore(
    (s) => [
      agentSelectors.currentAgent(s).avatar,
      agentSelectors.currentAgentSlicedTitle(s),
      agentSelectors.currentAgent(s).id,
      agentSelectors.currentAgent(s).avatarBackground,
      s.dispatchAgent,
    ],
    isEqual,
  );

  return (
    <Popover
      trigger={'click'}
      rootClassName={styles.popover}
      content={
        <div className={styles.picker}>
          <Picker
            i18n={i18n}
            data={data}
            locale={'zh'}
            onEmojiSelect={(e: any) => {
              dispatchAgent({ type: 'updateAgentData', id, key: 'avatar', value: e.native });
            }}
            skinTonePosition={'none'}
            theme={'auto'}
          />
        </div>
      }
    >
      <div style={{ width: 'fit-content' }}>
        <AgentAvatar background={avatarBackground} title={title} size={64} avatar={avatar} />
      </div>
    </Popover>
  );
};

export default EmojiPicker;
