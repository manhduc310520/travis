import React from 'react';
import { Checkbox, Flex } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Checkbox aria-label="Checkbox" defaultChecked={false} disabled />
    <Checkbox aria-label="Checkbox" indeterminate disabled />
    <Checkbox aria-label="Checkbox" defaultChecked disabled />
  </Flex>
);

export default App;
