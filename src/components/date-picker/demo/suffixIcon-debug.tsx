import React from 'react';
import { DatePicker, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space orientation="vertical">
    <DatePicker aria-label="Date" suffixIcon />
    <DatePicker aria-label="Date" suffixIcon={false} />
    <DatePicker aria-label="Date" />
    <DatePicker aria-label="Date" suffixIcon={null} />
    <DatePicker aria-label="Date" suffixIcon={'123'} />
  </Space>
);

export default App;
