import React from 'react';
import { UserOutlined } from '@fabi/ui/icons';
import { Avatar, Badge, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space size={24}>
    <Badge count={1}>
      <Avatar shape="square" icon={<UserOutlined />} />
    </Badge>
    <Badge dot>
      <Avatar shape="square" icon={<UserOutlined />} />
    </Badge>
  </Space>
);

export default App;
