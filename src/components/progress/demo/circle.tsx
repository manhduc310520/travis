import React from 'react';
import { Flex, Progress } from '@fabi/ui';

const App: React.FC = () => (
  <Flex gap="small" wrap>
    <Progress aria-label="Progress" type="circle" percent={75} />
    <Progress aria-label="Progress" type="circle" percent={70} status="exception" />
    <Progress aria-label="Progress" type="circle" percent={100} />
  </Flex>
);

export default App;
