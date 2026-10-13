import React from 'react';
import { NotificationOutlined } from '@fabi/ui/icons';
import { Badge, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space>
    <Badge dot>
      <NotificationOutlined style={{ fontSize: 16 }} />
    </Badge>
    <Badge dot>
      <a href="#">Link something</a>
    </Badge>
  </Space>
);

export default App;
