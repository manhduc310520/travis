import React from 'react';
import type { DatePickerProps } from '@fabi/ui';
import { DatePicker, Flex } from '@fabi/ui';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const onChange: DatePickerProps<Dayjs, true>['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

const defaultValue = [dayjs('2000-01-01'), dayjs('2000-01-03'), dayjs('2000-01-05')];

const App: React.FC = () => (
  <Flex vertical gap="small">
    <DatePicker aria-label="Date"
      multiple
      onChange={onChange}
      maxTagCount="responsive"
      defaultValue={defaultValue}
      size="small"
    />
    <DatePicker aria-label="Date" multiple onChange={onChange} maxTagCount="responsive" defaultValue={defaultValue} />
    <DatePicker aria-label="Date"
      multiple
      onChange={onChange}
      maxTagCount="responsive"
      defaultValue={defaultValue}
      size="large"
    />
  </Flex>
);

export default App;
