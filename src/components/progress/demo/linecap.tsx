import React from 'react';
import { Flex, Progress } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap="small">
    <Progress aria-label="Progress" strokeLinecap="butt" percent={75} />
    <Flex wrap gap="small">
      <Progress aria-label="Progress" strokeLinecap="butt" type="circle" percent={75} />
      <Progress aria-label="Progress" strokeLinecap="butt" type="dashboard" percent={75} />
    </Flex>
  </Flex>
);

export default App;
