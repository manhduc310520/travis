import React from 'react';
import { ClockCircleOutlined } from '@fabi/ui/icons';
import { Input, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space vertical style={{ width: '100%' }}>
    <Input aria-label="Error" status="error" placeholder="Error" />
    <Input aria-label="Warning" status="warning" placeholder="Warning" />
    <Input aria-label="Error with prefix" status="error" prefix={<ClockCircleOutlined />} placeholder="Error with prefix" />
    <Input aria-label="Warning with prefix" status="warning" prefix={<ClockCircleOutlined />} placeholder="Warning with prefix" />
  </Space>
);

export default App;
