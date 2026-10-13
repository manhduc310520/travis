import React from 'react';
import { Flex, Progress } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap="small" style={{ width: 180 }}>
    <Progress aria-label="Progress" percent={30} size="small" />
    <Progress aria-label="Progress" percent={50} size="small" status="active" />
    <Progress aria-label="Progress" percent={70} size="small" status="exception" />
    <Progress aria-label="Progress" percent={100} size="small" />
  </Flex>
);

export default App;
