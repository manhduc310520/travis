import React from 'react';
import { Flex, Input, InputNumber, Select } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap={16}>
    <Flex gap={8} align="center">
      <InputNumber aria-label="Number"
        style={{ width: 100, background: 'lightpink' }}
        variant="borderless"
        size="large"
      />
      <Input aria-label="Input" style={{ width: 100, background: 'lightpink' }} variant="borderless" size="large" />
      <Select aria-label="Select" style={{ width: 100, background: 'lightpink' }} variant="borderless" size="large" />
    </Flex>
    <Flex gap={8} align="center">
      <InputNumber aria-label="Number" style={{ width: 100, background: 'lightpink' }} variant="borderless" />
      <Input aria-label="Input" style={{ width: 100, background: 'lightpink' }} variant="borderless" />
      <Select aria-label="Select" style={{ width: 100, background: 'lightpink' }} variant="borderless" />
    </Flex>
    <Flex gap={8} align="center">
      <InputNumber aria-label="Number"
        style={{ width: 100, background: 'lightpink' }}
        variant="borderless"
        size="small"
      />
      <Input aria-label="Input" style={{ width: 100, background: 'lightpink' }} variant="borderless" size="small" />
      <Select aria-label="Select" style={{ width: 100, background: 'lightpink' }} variant="borderless" size="small" />
    </Flex>
  </Flex>
);

export default App;
