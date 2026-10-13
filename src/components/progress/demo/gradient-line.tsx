import React from 'react';
import { Flex, Progress } from '@fabi/ui';
import type { ProgressProps } from '@fabi/ui';

const twoColors: ProgressProps['strokeColor'] = {
  '0%': '#0958d9',
  '100%': '#237804',
};

const conicColors: ProgressProps['strokeColor'] = {
  '0%': '#237804',
  '50%': '#ffe58f',
  '100%': '#ffccc7',
};

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Progress aria-label="Progress" percent={99.9} strokeColor={twoColors} />
    <Progress aria-label="Progress" percent={50} status="active" strokeColor={{ from: '#0958d9', to: '#237804' }} />
    <Flex gap="small" wrap>
      <Progress aria-label="Progress" type="circle" percent={90} strokeColor={twoColors} />
      <Progress aria-label="Progress" type="circle" percent={100} strokeColor={twoColors} />
      <Progress aria-label="Progress" type="circle" percent={93} strokeColor={conicColors} />
    </Flex>
    <Flex gap="small" wrap>
      <Progress aria-label="Progress" type="dashboard" percent={90} strokeColor={twoColors} />
      <Progress aria-label="Progress" type="dashboard" percent={100} strokeColor={twoColors} />
      <Progress aria-label="Progress" type="dashboard" percent={93} strokeColor={conicColors} />
    </Flex>
  </Flex>
);

export default App;
