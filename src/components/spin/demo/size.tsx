import React from 'react';
import { Flex, Spin } from '@fabi/ui';

const App: React.FC = () => (
  <Flex align="center" gap="medium">
    <Spin size="small" />
    <Spin />
    <Spin size="large" />
  </Flex>
);

export default App;
