import React from 'react';
import { SmileOutlined } from '@fabi/ui/icons';
import { DatePicker, Space } from '@fabi/ui';
import type { Dayjs } from 'dayjs';

const smileIcon = <SmileOutlined />;
const { RangePicker } = DatePicker;

const onChange = (date: Dayjs | (Dayjs | null)[] | null, dateString: string | string[] | null) => {
  console.log(date, dateString);
};

const App: React.FC = () => (
  <Space vertical size={12}>
    <DatePicker aria-label="Date" suffixIcon={smileIcon} onChange={onChange} />
    <DatePicker aria-label="Date" suffixIcon={smileIcon} onChange={onChange} picker="month" />
    <RangePicker aria-label="Date range" suffixIcon={smileIcon} onChange={onChange} />
    <DatePicker aria-label="Date" suffixIcon={smileIcon} onChange={onChange} picker="week" />
    <DatePicker aria-label="Date" suffixIcon="ab" onChange={onChange} />
    <DatePicker aria-label="Date" suffixIcon="ab" onChange={onChange} picker="month" />
    <RangePicker aria-label="Date range" suffixIcon="ab" onChange={onChange} />
    <DatePicker aria-label="Date" suffixIcon="ab" onChange={onChange} picker="week" />
    <DatePicker aria-label="Date" prefix={smileIcon} onChange={onChange} picker="week" />
    <DatePicker aria-label="Date" prefix="Event Period" onChange={onChange} picker="week" />
    <RangePicker aria-label="Date range" prefix={smileIcon} onChange={onChange} picker="week" />
    <RangePicker aria-label="Date range" prefix="Event Period" onChange={onChange} picker="week" />
  </Space>
);

export default App;
