import React from 'react';
import { Avatar, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space>
    <Avatar alt="Avatar" shape="circle" src="/mock-assets/not-exist.jpg">
      A
    </Avatar>
    <Avatar alt="Avatar" shape="circle" src="/mock-assets/not-exist.jpg">
      ABC
    </Avatar>
  </Space>
);

export default App;
