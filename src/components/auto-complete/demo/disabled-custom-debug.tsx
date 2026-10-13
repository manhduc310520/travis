import React from 'react';
import { AutoComplete, Flex, Input, Select } from '@fabi/ui';

const App: React.FC = () => (
  <Flex gap={12} wrap>
    <Input aria-label="Regular Input" disabled placeholder="Regular Input" />
    <AutoComplete aria-label="Search" disabled>
      <Input.TextArea aria-label="Text" disabled />
    </AutoComplete>
    <Select aria-label="Select" disabled options={[]} />
  </Flex>
);

export default App;
