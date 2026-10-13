import React from 'react';
import { Flex, InputNumber } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap={12}>
    <InputNumber aria-label="Outlined" placeholder="Outlined" style={{ width: 200 }} />
    <InputNumber aria-label="Filled" placeholder="Filled" variant="filled" style={{ width: 200 }} />
    <InputNumber aria-label="Borderless" placeholder="Borderless" variant="borderless" style={{ width: 200 }} />
    <InputNumber aria-label="Underlined" placeholder="Underlined" variant="underlined" style={{ width: 200 }} />
  </Flex>
);

export default App;
