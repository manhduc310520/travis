import React from 'react';
import { Flex, Transfer } from '@fabi/ui';

const App: React.FC = () => (
  <Flex gap="medium" vertical>
    <Transfer status="error" />
    <Transfer status="warning" showSearch />
  </Flex>
);

export default App;
