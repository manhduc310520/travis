import React from 'react';
import { Avatar, ConfigProvider, List } from '@fabi/ui';

const data = [
  {
    title: 'FABi CMS Title 1',
  },
];

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      components: {
        List: {
          colorText: 'red',
        },
      },
    }}
  >
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar alt="Avatar" src={`/mock-assets/avatar-${(Math.abs(Number(index)) % 12) + 1}.svg`} />}
            title={<a href="https://example.com">{item.title}</a>}
            description="FABi CMS, a design language for background applications, is refined by the FABi CMS team"
          />
        </List.Item>
      )}
    />
  </ConfigProvider>
);

export default App;
