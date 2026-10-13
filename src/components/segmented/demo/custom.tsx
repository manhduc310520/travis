import React from 'react';
import { UserOutlined } from '@fabi/ui/icons';
import { Avatar, Flex, Segmented } from '@fabi/ui';

const App: React.FC = () => (
  <Flex gap="small" align="flex-start" vertical>
    <Segmented
      options={[
        {
          label: (
            <div style={{ padding: 4 }}>
              <Avatar src="/mock-assets/avatar-9.svg" alt="User 1" />
              <div>User 1</div>
            </div>
          ),
          value: 'user1',
          tooltip: { title: 'hello user1', color: 'gold' },
        },
        {
          label: (
            <div style={{ padding: 4 }}>
              <Avatar style={{ backgroundColor: '#873800' }} alt="User 2">
                K
              </Avatar>
              <div>User 2</div>
            </div>
          ),
          value: 'user2',
          tooltip: { title: 'hello user2', color: 'pink' },
        },
        {
          label: (
            <div style={{ padding: 4 }}>
              <Avatar style={{ backgroundColor: '#237804' }} icon={<UserOutlined />} alt="User 3" />
              <div>User 3</div>
            </div>
          ),
          value: 'user3',
          tooltip: { title: 'hello user3', color: 'geekblue' },
        },
      ]}
    />
    <Segmented
      options={[
        {
          label: (
            <div style={{ padding: 4 }}>
              <div>Spring</div>
              <div>Jan-Mar</div>
            </div>
          ),
          value: 'spring',
        },
        {
          label: (
            <div style={{ padding: 4 }}>
              <div>Summer</div>
              <div>Apr-Jun</div>
            </div>
          ),
          value: 'summer',
        },
        {
          label: (
            <div style={{ padding: 4 }}>
              <div>Autumn</div>
              <div>Jul-Sept</div>
            </div>
          ),
          value: 'autumn',
        },
        {
          label: (
            <div style={{ padding: 4 }}>
              <div>Winter</div>
              <div>Oct-Dec</div>
            </div>
          ),
          value: 'winter',
        },
      ]}
    />
  </Flex>
);

export default App;
