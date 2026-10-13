import React from 'react';
import { DatePicker, Space } from '@fabi/ui';

const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Space vertical size={12}>
    <RangePicker aria-label="Date range" />
    <RangePicker aria-label="Date range" showTime />
    <RangePicker aria-label="Date range" picker="week" />
    <RangePicker aria-label="Date range" picker="month" />
    <RangePicker aria-label="Date range" picker="quarter" />
    <RangePicker
      picker="year"
      id={{
        start: 'startInput',
        end: 'endInput',
      }}
      onFocus={(_, info) => {
        console.log('Focus:', info.range);
      }}
      onBlur={(_, info) => {
        console.log('Blur:', info.range);
      }}
    />
  </Space>
);

export default App;
