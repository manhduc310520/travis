import React from 'react';
import { Avatar, List } from '@fabi/ui';

const data = [
  {
    title: 'FABi CMS Title 1',
  },
  {
    title: 'FABi CMS Title 2',
  },
  {
    title: 'FABi CMS Title 3',
  },
  {
    title: 'FABi CMS Title 4',
  },
];

const App: React.FC = () => (
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
);

export default App;
