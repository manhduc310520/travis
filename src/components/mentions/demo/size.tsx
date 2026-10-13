import React from 'react';
import { Flex, Mentions } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Mentions aria-label="large size" size="large" placeholder="large size" />
    <Mentions aria-label="default size" placeholder="default size" />
    <Mentions aria-label="small size" size="small" placeholder="small size" />
  </Flex>
);

export default App;
