import React from 'react';
import { ClockCircleOutlined } from '@fabi/ui/icons';
import { Avatar, Badge, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space size="medium">
    <Badge count={5}>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge count={0} showZero>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge count={<ClockCircleOutlined style={{ color: '#f5222d' }} />}>
      <Avatar shape="square" size="large" />
    </Badge>
  </Space>
);

export default App;
