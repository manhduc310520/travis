import React from 'react';
import { Flex, Progress } from '@fabi/ui';

const App: React.FC = () => (
  <Flex gap="small" wrap>
    <Progress aria-label="Progress" type="circle" percent={75} format={(percent) => `${percent} Days`} />
    <Progress aria-label="Progress" type="circle" percent={100} format={() => 'Done'} />
  </Flex>
);

export default App;
