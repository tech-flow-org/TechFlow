import AgentAvatar from '@/components/AgentAvatar';
import data from '@emoji-mart/data';
import i18n from '@emoji-mart/data/i18n/zh.json';
import Picker from '@emoji-mart/react';
import { Popover } from 'antd';
import { createStyles } from 'antd-style';
import chroma from 'chroma-js';

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

const EmojiPicker: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
}> = (props) => {
  const { styles } = useStyles();

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
              props.onChange?.(e.unified);
            }}
            skinTonePosition={'none'}
            theme={'auto'}
          />
        </div>
      }
    >
      <div style={{ width: 'fit-content' }}>
        <AgentAvatar
          background="#FFF"
          title="头像"
          size={64}
          avatar={props.value ? String.fromCodePoint(parseInt(props.value, 16)) : undefined}
        />
      </div>
    </Popover>
  );
};

export default EmojiPicker;
