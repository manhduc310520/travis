import React from 'react';
import { Flex, Progress } from '@fabi/ui';

const App: React.FC = () => (
  <Flex align="center" gap="small">
    <Progress aria-label="Progress"
      type="circle"
      railColor="#0958d9"
      percent={60}
      strokeWidth={20}
      size={14}
      format={(number) => `In progress, ${number}% complete`}
    />
    <span>Code release</span>
  </Flex>
);

export default App;
