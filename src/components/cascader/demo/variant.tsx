import React from 'react';
import { Cascader, Flex } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Cascader aria-label="Please select" placeholder="Please select" variant="borderless" />
    <Cascader aria-label="Please select" placeholder="Please select" variant="filled" />
    <Cascader aria-label="Please select" placeholder="Please select" variant="outlined" />
    <Cascader aria-label="Please select" placeholder="Please select" variant="underlined" />
  </Flex>
);

export default App;
