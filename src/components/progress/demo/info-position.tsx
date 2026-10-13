import React from 'react';
import { Flex, Progress } from '@fabi/ui';

const App: React.FC = () => (
  <Flex gap="small" vertical>
    <Progress aria-label="Progress"
      percent={0}
      percentPosition={{ align: 'center', type: 'inner' }}
      size={[200, 20]}
      strokeColor="#0958d9"
    />
    <Progress aria-label="Progress" percent={10} percentPosition={{ align: 'center', type: 'inner' }} size={[300, 20]} />
    <Progress aria-label="Progress"
      percent={50}
      percentPosition={{ align: 'start', type: 'inner' }}
      size={[300, 20]}
      strokeColor="#237804"
    />
    <Progress aria-label="Progress"
      percent={60}
      percentPosition={{ align: 'end', type: 'inner' }}
      size={[300, 20]}
      strokeColor="#001342"
    />
    <Progress aria-label="Progress" percent={100} percentPosition={{ align: 'center', type: 'inner' }} size={[400, 20]} />
    <Progress aria-label="Progress" percent={60} percentPosition={{ align: 'start', type: 'outer' }} />
    <Progress aria-label="Progress" percent={100} percentPosition={{ align: 'start', type: 'outer' }} />
    <Progress aria-label="Progress" percent={60} percentPosition={{ align: 'center', type: 'outer' }} size="small" />
    <Progress aria-label="Progress" percent={100} percentPosition={{ align: 'center', type: 'outer' }} />
  </Flex>
);

export default App;
