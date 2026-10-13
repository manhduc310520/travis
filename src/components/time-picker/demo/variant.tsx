import React from 'react';
import { Flex, TimePicker } from '@fabi/ui';

const { RangePicker } = TimePicker;

const App: React.FC = () => (
  <Flex vertical gap={12}>
    <Flex gap={8}>
      <TimePicker aria-label="Outlined" placeholder="Outlined" />
      <RangePicker aria-label="Date range" placeholder={['Outlined Start', 'Outlined End']} />
    </Flex>
    <Flex gap={8}>
      <TimePicker aria-label="Filled" variant="filled" placeholder="Filled" />
      <RangePicker aria-label="Date range" variant="filled" placeholder={['Filled Start', 'Filled End']} />
    </Flex>
    <Flex gap={8}>
      <TimePicker aria-label="Borderless" variant="borderless" placeholder="Borderless" />
      <RangePicker aria-label="Date range" variant="borderless" placeholder={['Borderless Start', 'Borderless End']} />
    </Flex>
    <Flex gap={8}>
      <TimePicker aria-label="Underlined" variant="underlined" placeholder="Underlined" />
      <RangePicker aria-label="Date range" variant="underlined" placeholder={['Underlined Start', 'Underlined End']} />
    </Flex>
  </Flex>
);

export default App;
