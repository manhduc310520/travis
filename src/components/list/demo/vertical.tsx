import React from 'react';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@fabi/ui/icons';
import { Avatar, List, Space } from '@fabi/ui';

const data = Array.from({ length: 23 }).map((_, i) => ({
  href: 'https://example.com',
  title: `FABi CMS part ${i}`,
  avatar: `/mock-assets/avatar-${(Math.abs(Number(i)) % 12) + 1}.svg`,
  description:
    'FABi CMS, a design language for background applications, is refined by the FABi CMS team.',
  content:
    'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
}));

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const App: React.FC = () => (
  <List
    itemLayout="vertical"
    size="large"
    pagination={{
      onChange: (page) => {
        console.log(page);
      },
      pageSize: 3,
    }}
    dataSource={data}
    footer={
      <div>
        <b>FABi CMS</b> footer part
      </div>
    }
    renderItem={(item) => (
      <List.Item
        key={item.title}
        actions={[
          <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
          <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
          <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
        ]}
        extra={
          <img
            draggable={false}
            width={272}
            alt="logo"
            src="/mock-assets/photo-2.svg"
          />
        }
      >
        <List.Item.Meta
          avatar={<Avatar alt="Avatar" src={item.avatar} />}
          title={<a href={item.href}>{item.title}</a>}
          description={item.description}
        />
        {item.content}
      </List.Item>
    )}
  />
);

export default App;
