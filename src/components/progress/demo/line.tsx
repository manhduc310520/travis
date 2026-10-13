import React from 'react';
import { Flex, Progress } from '@fabi/ui';

const App: React.FC = () => (
  <Flex gap="small" vertical>
    <Progress aria-label="Progress" percent={30} />
    <Progress aria-label="Progress" percent={50} status="active" />
    <Progress aria-label="Progress" percent={70} status="exception" />
    <Progress aria-label="Progress" percent={100} />
    <Progress aria-label="Progress" percent={50} showInfo={false} />
  </Flex>
);

export default App;
