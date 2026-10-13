import React from 'react';
import { Button, Flex } from '@fabi/ui';

const App: React.FC = () => (
  <Flex gap="small" wrap>
    <Button type="primary" autoInsertSpace={false}>
      确定
    </Button>
    <Button type="primary" autoInsertSpace>
      确定
    </Button>
  </Flex>
);

export default App;
