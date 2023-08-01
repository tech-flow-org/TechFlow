import { useEffect, useRef, useState } from 'react';

import Markdown from '@/components/Markdown';
import { Mask, useMaskStore } from '@/store/mask';
import { EyeOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import router from 'next/router';
import styles from './index.module.css';
import { MaskLayout } from './layout';

function MaskItem(props: { mask: Mask; onClick?: () => void }) {
  return (
    <div className={styles['mask']} onClick={props.onClick}>
      {props.mask.avatar
        .split('-')
        .map((item) => {
          try {
            return String.fromCodePoint(parseInt(item, 16));
          } catch (error) {
            return '🤖';
          }
        })
        .join('') || '🤖'}
      <div className={styles['mask-name'] + ' one-line'}>{props.mask.name}</div>
    </div>
  );
}

function useMaskGroup(masks: Mask[]) {
  const [groups, setGroups] = useState<Mask[][]>([]);

  useEffect(() => {
    const computeGroup = () => {
      const appBody = document.getElementById('app-body');
      if (!appBody || masks.length === 0) return;

      const rect = appBody.getBoundingClientRect();
      const maxWidth = rect.width;
      const maxHeight = rect.height * 0.6;
      const maskItemWidth = 120;
      const maskItemHeight = 50;

      const randomMask = () => masks[Math.floor(Math.random() * masks.length)];
      let maskIndex = 0;
      const nextMask = () => masks[maskIndex++ % masks.length];

      const rows = Math.ceil(maxHeight / maskItemHeight);
      const cols = Math.ceil(maxWidth / maskItemWidth);

      const newGroups = new Array(rows)
        .fill(0)
        .map(() =>
          new Array(cols)
            .fill(0)
            .map((_, j) => (j < 1 || j > cols - 2 ? randomMask() : nextMask())),
        );

      setGroups(newGroups);
    };

    computeGroup();

    window.addEventListener('resize', computeGroup);
    return () => window.removeEventListener('resize', computeGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return groups;
}

function MaskPage() {
  const maskStore = useMaskStore();

  const [masks, setMasks] = useState<Mask[]>([]);
  useEffect(() => {
    maskStore.getAll().then((queryList) => {
      setMasks(queryList);
    });
  }, []);
  const groups = useMaskGroup(masks);

  const [mask, setMask] = useState<Mask | null>();

  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (maskRef.current) {
      maskRef.current.scrollLeft = (maskRef.current.scrollWidth - maskRef.current.clientWidth) / 2;
    }
  }, [groups]);

  return (
    <MaskLayout>
      <div className={styles['new-chat']}>
        <div className={styles['mask-cards']}>
          <div className={styles['mask-card']}>😀</div>
          <div className={styles['mask-card']}>👺</div>
          <div className={styles['mask-card']}>🤖</div>
        </div>

        <div className={styles['title']}>选择一个角色</div>
        <div className={styles['sub-title']}>现在开始，以更专业的方式使用 LLM</div>

        <div className={styles['actions']}>
          <Button
            size="large"
            onClick={() => {
              router.push('/mask/list');
            }}
            icon={<EyeOutlined />}
          >
            查看更多
          </Button>
          <Button
            size="large"
            onClick={() => {
              router.push('/mask/new');
            }}
            icon={<UserAddOutlined />}
            type="primary"
            className={styles['skip']}
          >
            新建角色
          </Button>
        </div>

        <div className={styles['masks']} ref={maskRef} id="app-body">
          {groups.map((masks, i) => (
            <div key={i} className={styles['mask-row']}>
              {masks.map(
                (mask, index) =>
                  mask && (
                    <MaskItem
                      key={index}
                      mask={mask}
                      onClick={() => {
                        setMask(mask);
                      }}
                    />
                  ),
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal
        width={800}
        title={mask?.name}
        open={!!mask?.id}
        onCancel={() => {
          setMask(null);
        }}
        footer={null}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {mask?.context.map((item, index) => {
            return (
              <div key={item.id || index}>
                <Markdown>{item.content || ''}</Markdown>
              </div>
            );
          })}
        </div>
      </Modal>
    </MaskLayout>
  );
}

export default MaskPage;
