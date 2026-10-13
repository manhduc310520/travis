import React from 'react';
import type { DatePickerProps } from '@fabi/ui';
import { DatePicker, Flex } from '@fabi/ui';

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

const Demo: React.FC = () => (
  <Flex gap="small" justify="flex-start" align="flex-start" vertical>
    <DatePicker aria-label="Date" onChange={onChange} />
    <DatePicker aria-label="Date" onChange={onChange} picker="week" />
    <DatePicker aria-label="Date" onChange={onChange} picker="month" />
    <DatePicker aria-label="Date" onChange={onChange} picker="quarter" />
    <DatePicker aria-label="Date" onChange={onChange} picker="year" />
  </Flex>
);

export default Demo;
