import React from 'react';
import { Space, TimePicker } from '@fabi/ui';

const App: React.FC = () => (
  <Space vertical>
    <TimePicker aria-label="Time" status="error" />
    <TimePicker aria-label="Time" status="warning" />
    <TimePicker.RangePicker aria-label="Time range" status="error" />
    <TimePicker.RangePicker aria-label="Time range" status="warning" />
  </Space>
);

export default App;
