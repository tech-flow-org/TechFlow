import AgentAvatar from '@/components/AgentAvatar';
import Markdown from '@/components/Markdown';
import { Sidebar } from '@/features/Sidebar';
import { Mask, useMaskStore } from '@/store/mask';
import { UserAddOutlined } from '@ant-design/icons';
import { Button, List, Modal } from 'antd';
import Head from 'next/head';
import router from 'next/router';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';

const MaskLayout: React.FC<{
  children: React.ReactNode;
}> = () => {
  const maskStore = useMaskStore();
  const masks = maskStore.getAll();

  const [mask, setMask] = useState<Mask | null>();

  return (
    <>
      <Head>
        <title>角色列表</title>
      </Head>
      <Flexbox id={'RunnerLayout'} horizontal width="100%" height={'100%'}>
        <Sidebar />
        <div
          style={{
            padding: '0 8px',
            width: '100%',
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <List
            header={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span> 角色列表</span>
                <Button
                  onClick={() => {
                    router.push('/mask/new');
                  }}
                  icon={<UserAddOutlined />}
                  type="primary"
                >
                  新建角色
                </Button>
              </div>
            }
            itemLayout="horizontal"
            dataSource={masks}
            renderItem={(item) => {
              let avatar = item.avatar;
              try {
                avatar = item.avatar ? String.fromCodePoint(parseInt(item.avatar, 16)) : '🤖';
              } catch (error) {}
              return (
                <List.Item
                  id={item.id + ''}
                  actions={[
                    <a
                      key="list-edit"
                      onClick={() => {
                        setMask(item);
                      }}
                    >
                      查看
                    </a>,
                    <a
                      key="list-more"
                      onClick={() => {
                        maskStore.delete(item.id);
                      }}
                    >
                      删除
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <AgentAvatar background="#FFF" title="头像" size={48} avatar={avatar} />
                    }
                    title={item.name}
                    description={
                      <div
                        style={{
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {item.context.at(0)?.content}
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </div>
      </Flexbox>
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
    </>
  );
};

export default MaskLayout;
