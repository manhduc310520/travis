import React from 'react';
import { Flex, Progress } from '@fabi/ui';

const App: React.FC = () => (
  <Flex wrap gap="small">
    <Progress aria-label="Progress" type="circle" percent={30} size={80} />
    <Progress aria-label="Progress" type="circle" percent={70} size={80} status="exception" />
    <Progress aria-label="Progress" type="circle" percent={100} size={80} />
  </Flex>
);

export default App;
