import React from 'react';
import { DatePicker, Space } from '@fabi/ui';

const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Space vertical size={12}>
    <DatePicker aria-label="Date" renderExtraFooter={() => 'extra footer'} />
    <DatePicker aria-label="Date" renderExtraFooter={() => 'extra footer'} showTime />
    <RangePicker aria-label="Date range" renderExtraFooter={() => 'extra footer'} />
    <RangePicker aria-label="Date range" renderExtraFooter={() => 'extra footer'} showTime />
    <DatePicker aria-label="Date" renderExtraFooter={() => 'extra footer'} picker="month" />
  </Space>
);

export default App;
