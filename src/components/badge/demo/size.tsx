import React from 'react';
import { Avatar, Badge, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space size="medium">
    <Badge size="medium" count={5}>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge size="small" count={5}>
      <Avatar shape="square" size="large" />
    </Badge>
  </Space>
);

export default App;
