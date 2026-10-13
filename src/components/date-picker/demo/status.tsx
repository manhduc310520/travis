import React from 'react';
import { DatePicker, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space vertical style={{ width: '100%' }}>
    <DatePicker aria-label="Date" status="error" style={{ width: '100%' }} />
    <DatePicker aria-label="Date" status="warning" style={{ width: '100%' }} />
    <DatePicker.RangePicker aria-label="Date range" status="error" style={{ width: '100%' }} />
    <DatePicker.RangePicker aria-label="Date range" status="warning" style={{ width: '100%' }} />
  </Space>
);

export default App;
