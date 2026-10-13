import React from 'react';
import { Flex, Mentions } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap={12}>
    <Mentions aria-label="Outlined" placeholder="Outlined" />
    <Mentions aria-label="Filled" placeholder="Filled" variant="filled" />
    <Mentions aria-label="Borderless" placeholder="Borderless" variant="borderless" />
    <Mentions aria-label="Underlined" placeholder="Underlined" variant="underlined" />
  </Flex>
);

export default App;
