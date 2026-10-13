import React from 'react';
import { AutoComplete, Flex, Input } from '@fabi/ui';

const options = [{ value: 'Burnaby' }, { value: 'Seattle' }, { value: 'Los Angeles' }];

const App: React.FC = () => (
  <Flex vertical gap={24} style={{ width: 300 }}>
    <AutoComplete aria-label="Search" allowClear defaultValue="Burnaby" options={options}>
      <Input aria-label="Input" />
    </AutoComplete>
    <AutoComplete aria-label="Search" allowClear defaultValue="Burnaby" options={options}>
      <Input.TextArea aria-label="Text" />
    </AutoComplete>
  </Flex>
);

export default App;
