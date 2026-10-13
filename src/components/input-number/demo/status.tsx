import React from 'react';
import { ClockCircleOutlined } from '@fabi/ui/icons';
import { InputNumber, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space vertical style={{ width: '100%' }}>
    <InputNumber aria-label="Number" status="error" style={{ width: '100%' }} />
    <InputNumber aria-label="Number" status="warning" style={{ width: '100%' }} />
    <InputNumber aria-label="Number" status="error" style={{ width: '100%' }} prefix={<ClockCircleOutlined />} />
    <InputNumber aria-label="Number" status="warning" style={{ width: '100%' }} prefix={<ClockCircleOutlined />} />
  </Space>
);

export default App;
