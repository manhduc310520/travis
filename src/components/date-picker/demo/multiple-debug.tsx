import React from 'react';
import { DatePicker, Flex } from '@fabi/ui';
import dayjs from 'dayjs';

const defaultValue = Array.from({ length: 10 }).map((_, i) => dayjs('2000-01-01').add(i, 'day'));

const App: React.FC = () => (
  <Flex vertical gap="small">
    <DatePicker aria-label="Bamboo" multiple placeholder="Bamboo" />
    <DatePicker aria-label="Date" multiple defaultValue={defaultValue} size="small" />
    <DatePicker aria-label="Date" multiple defaultValue={defaultValue} />
    <DatePicker aria-label="Date" multiple defaultValue={defaultValue} size="large" />
  </Flex>
);

export default App;
