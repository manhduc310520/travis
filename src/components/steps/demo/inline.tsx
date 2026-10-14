import React from 'react';
import type { StepsProps } from '@fabi/ui';
import { Avatar, List, Steps } from '@fabi/ui';

const data = [
  {
    title: 'FABi CMS Title 1',
    current: 0,
  },
  {
    title: 'FABi CMS Title 2',
    current: 1,
    status: 'error',
  },
  {
    title: 'FABi CMS Title 3',
    current: 2,
  },
  {
    title: 'FABi CMS Title 4',
    current: 1,
  },
];

const items = [
  {
    title: 'Step 1',
    content: 'This is Step 1',
  },
  {
    title: 'Step 2',
    content: 'This is Step 2',
  },
  {
    title: 'Step 3',
    content: 'This is Step 3',
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
          description="FABi CMS, a back office for restaurants, keeps menus, orders and staff in one place"
        />
        <Steps
          style={{ marginTop: 8 }}
          type="inline"
          current={item.current}
          status={item.status as StepsProps['status']}
          items={items}
        />
      </List.Item>
    )}
  />
);

export default App;
