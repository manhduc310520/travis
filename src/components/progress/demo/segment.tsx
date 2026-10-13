import React from 'react';
import { Flex, Progress, Tooltip } from '@fabi/ui';

const App: React.FC = () => (
  <Flex gap="small" vertical>
    <Tooltip title="3 done / 3 in progress / 4 to do">
      <Progress aria-label="Progress" percent={60} success={{ percent: 30 }} />
    </Tooltip>
    <Flex gap="small" wrap>
      <Tooltip title="3 done / 3 in progress / 4 to do">
        <Progress aria-label="Progress" percent={60} success={{ percent: 30 }} type="circle" />
      </Tooltip>
      <Tooltip title="3 done / 3 in progress / 4 to do">
        <Progress aria-label="Progress" percent={60} success={{ percent: 30 }} type="dashboard" />
      </Tooltip>
    </Flex>
  </Flex>
);

export default App;
