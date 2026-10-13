import React from 'react';
import { Flex, Input } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap={12}>
    <Input aria-label="Outlined" placeholder="Outlined" />
    <Input aria-label="Filled" placeholder="Filled" variant="filled" />
    <Input aria-label="Borderless" placeholder="Borderless" variant="borderless" />
    <Input aria-label="Underlined" placeholder="Underlined" variant="underlined" />
    <Input.Search aria-label="Filled" placeholder="Filled" variant="filled" />
  </Flex>
);

export default App;
