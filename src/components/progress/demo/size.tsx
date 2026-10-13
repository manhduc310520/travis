import React from 'react';
import { Flex, Progress } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Flex vertical gap="small" style={{ width: 300 }}>
      <Progress aria-label="Progress" percent={50} />
      <Progress aria-label="Progress" percent={50} size="small" />
      <Progress aria-label="Progress" percent={50} size={[300, 20]} />
    </Flex>
    <Flex align="center" wrap gap={30}>
      <Progress aria-label="Progress" type="circle" percent={50} />
      <Progress aria-label="Progress" type="circle" percent={50} size="small" />
      <Progress aria-label="Progress" type="circle" percent={50} size={20} />
    </Flex>
    <Flex align="center" wrap gap={30}>
      <Progress aria-label="Progress" type="dashboard" percent={50} />
      <Progress aria-label="Progress" type="dashboard" percent={50} size="small" />
      <Progress aria-label="Progress" type="dashboard" percent={50} size={20} />
    </Flex>
    <Flex align="center" wrap gap={30}>
      <Progress aria-label="Progress" steps={3} percent={50} />
      <Progress aria-label="Progress" steps={3} percent={50} size="small" />
      <Progress aria-label="Progress" steps={3} percent={50} size={20} />
      <Progress aria-label="Progress" steps={3} percent={50} size={[20, 30]} />
    </Flex>
  </Flex>
);

export default App;
