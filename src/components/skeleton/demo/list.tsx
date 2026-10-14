import React, { useState } from 'react';
import type Icon from '@fabi/ui/icons';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@fabi/ui/icons';
import { Avatar, List, Skeleton, Switch } from '@fabi/ui';

interface IconTextProps {
  icon: typeof Icon;
  text: React.ReactNode;
}

const listData = Array.from({ length: 3 }).map((_, i) => ({
  href: 'https://example.com',
  title: `FABi CMS part ${i + 1}`,
  avatar: `/mock-assets/avatar-${(Math.abs(Number(i)) % 12) + 1}.svg`,
  description:
    'FABi CMS, a back office for restaurants, keeps menus, orders and staff in one place.',
  content:
    'Each module comes with short guides, checklists and import templates, so a new branch can set up its menu and tables in a day.',
}));

const IconText: React.FC<IconTextProps> = ({ icon, text }) => (
  <>
    {React.createElement(icon, { style: { marginInlineEnd: 8 } })}
    {text}
  </>
);

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const onChange = (checked: boolean) => {
    setLoading(!checked);
  };

  return (
    <>
      <Switch aria-label="Switch" checked={!loading} onChange={onChange} style={{ marginBottom: 16 }} />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={listData}
        renderItem={(item) => (
          <List.Item
            key={item.title}
            actions={
              !loading
                ? [
                    <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                    <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                    <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                  ]
                : undefined
            }
            extra={
              !loading && (
                <img
                  draggable={false}
                  width={272}
                  alt="logo"
                  src="/mock-assets/photo-2.svg"
                />
              )
            }
          >
            <Skeleton loading={loading} active avatar>
              <List.Item.Meta
                avatar={<Avatar alt="Avatar" src={item.avatar} />}
                title={<a href={item.href}>{item.title}</a>}
                description={item.description}
              />
              {item.content}
            </Skeleton>
          </List.Item>
        )}
      />
    </>
  );
};

export default App;
