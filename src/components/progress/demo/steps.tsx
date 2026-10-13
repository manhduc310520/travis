import React from 'react';
import { green, red } from '@fabi/ui/colors';
import { Flex, Progress } from '@fabi/ui';

const App: React.FC = () => (
  <Flex gap="small" vertical>
    <Progress aria-label="Progress" percent={50} steps={3} />
    <Progress aria-label="Progress" percent={30} steps={5} />
    <Progress aria-label="Progress" percent={100} steps={5} size="small" strokeColor={green[6]} />
    <Progress aria-label="Progress" percent={60} steps={5} strokeColor={[green[6], green[6], red[5]]} />
  </Flex>
);

export default App;
