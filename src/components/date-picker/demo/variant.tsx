import React from 'react';
import { DatePicker, Flex } from '@fabi/ui';

const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Flex vertical gap={12}>
    <Flex gap={8}>
      <DatePicker aria-label="Outlined" placeholder="Outlined" />
      <RangePicker aria-label="Date range" placeholder={['Outlined Start', 'Outlined End']} />
    </Flex>
    <Flex gap={8}>
      <DatePicker aria-label="Filled" placeholder="Filled" variant="filled" />
      <RangePicker aria-label="Date range" placeholder={['Filled Start', 'Filled End']} variant="filled" />
    </Flex>
    <Flex gap={8}>
      <DatePicker aria-label="Borderless" placeholder="Borderless" variant="borderless" />
      <RangePicker aria-label="Date range" placeholder={['Borderless Start', 'Borderless End']} variant="borderless" />
    </Flex>
    <Flex gap={8}>
      <DatePicker aria-label="Underlined" placeholder="Underlined" variant="underlined" />
      <RangePicker aria-label="Date range" placeholder={['Underlined Start', 'Underlined End']} variant="underlined" />
    </Flex>
  </Flex>
);

export default App;
