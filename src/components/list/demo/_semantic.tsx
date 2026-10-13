import React from 'react';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@fabi/ui/icons';
import { Avatar, List, Space } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  cn: {
    extra: '设置额外内容',
    actions: '设置列表操作组',
  },
  en: {
    extra: 'set `extra` of List.Item',
    actions: 'set `actions` of List.Item',
  },
};

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const data = Array.from({ length: 1 }).map((_, i) => ({
  href: 'https://example.com',
  title: `FABi CMS part ${i}`,
  avatar: `/mock-assets/avatar-${(Math.abs(Number(i)) % 12) + 1}.svg`,
  description:
    'FABi CMS, a design language for background applications, is refined by the FABi CMS team.',
  content:
    'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
}));

const BlockList: React.FC<React.PropsWithChildren> = (props) => {
  const divRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={divRef} style={{ position: 'absolute', inset: 0, height: 300 }}>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            {...props}
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
    </div>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="List"
      height={300}
      semantics={[
        { name: 'extra', desc: locale.extra, version: '5.18.0' },
        { name: 'actions', desc: locale.actions, version: '5.18.0' },
      ]}
    >
      <BlockList />
    </SemanticPreview>
  );
};

export default App;
