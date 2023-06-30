import { Moon, Sun } from '@/components/Header/ThemeIcon';
import { IconAction } from '@/components/IconAction';
import { SettingOutlined } from '@ant-design/icons';
import { Avatar, Button, ConfigProvider, Popover, Space, Tooltip, Upload } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Settings from '@/components/Settings';
import { FlowIcon } from '@/features/Sidebar/Icons';
import { SidebarTabKey, useSettings } from '@/store/settings';
import { createUploadImageHandler } from '@/utils/uploadFIle';
import Link from 'next/link';
import { shallow } from 'zustand/shallow';
import { useStyles } from './style';

const tabs = [{ key: 'flow', title: '任务流', icon: FlowIcon }];

export const Sidebar = memo(() => {
  const { styles, theme } = useStyles();
  const [avatarImg, appearance, tabKey, fontSize] = useSettings(
    (s) => [s.avatar, s.appearance, s.sidebarKey || 'chat', s.fontSize],
    shallow,
  );

  const handleUploadAvatar = createUploadImageHandler((avatar) => {
    useSettings.setState({ avatar });
  });

  return (
    <ConfigProvider>
      <Flexbox distribution={'space-between'} align={'center'} className={styles.sidebar}>
        <Flexbox align={'center'} gap={24}>
          <Upload itemRender={() => null} maxCount={1} beforeUpload={handleUploadAvatar}>
            {!!avatarImg ? (
              <Avatar
                size={'large'}
                src={avatarImg}
                shape={'circle'}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <Avatar size={'large'} shape={'circle'} className={styles.user} />
            )}
          </Upload>
          <Flexbox align={'center'} gap={12}>
            {tabs.map((t) => {
              const active = t.key === tabKey;
              return (
                <Link
                  key={t.key}
                  href={`/${t.key}`}
                  onClick={() => {
                    useSettings.setState({ sidebarKey: t.key as SidebarTabKey });
                  }}
                >
                  <Tooltip arrow={false} placement={'right'} title={t.title}>
                    <Button
                      size={'large'}
                      type={active ? 'default' : 'text'}
                      icon={
                        <t.icon
                          style={{
                            fill: active ? theme.colorPrimary : theme.colorTextTertiary,
                          }}
                        />
                      }
                    />
                  </Tooltip>
                </Link>
              );
            })}
          </Flexbox>
        </Flexbox>
        <Space direction="vertical" size={fontSize}>
          <IconAction
            icon={
              appearance === 'dark' ? (
                <Moon width="1.2em" height="1.2em" />
              ) : (
                <Sun width="1.2em" height="1.2em" />
              )
            }
            onClick={() => {
              useSettings.setState({ appearance: appearance === 'dark' ? 'light' : 'dark' });
            }}
          />
          <Popover trigger={'click'} placement={'rightBottom'} content={<Settings />}>
            <Button type={'text'} icon={<SettingOutlined />} />
          </Popover>
        </Space>
      </Flexbox>
    </ConfigProvider>
  );
});
