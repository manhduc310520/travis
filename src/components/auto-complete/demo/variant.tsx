import React, { useState } from 'react';
import { AutoComplete, Flex } from '@fabi/ui';
import type { AutoCompleteProps } from '@fabi/ui';

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

const App: React.FC = () => {
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);

  const getPanelValue = (searchText: string) =>
    !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];

  return (
    <Flex vertical gap={12}>
      <AutoComplete aria-label="Outlined"
        options={options}
        style={{ width: 200 }}
        placeholder="Outlined"
        showSearch={{ onSearch: (text) => setOptions(getPanelValue(text)) }}
        onSelect={globalThis.console.log}
      />
      <AutoComplete aria-label="Filled"
        options={options}
        style={{ width: 200 }}
        placeholder="Filled"
        showSearch={{ onSearch: (text) => setOptions(getPanelValue(text)) }}
        onSelect={globalThis.console.log}
        variant="filled"
      />
      <AutoComplete aria-label="Borderless"
        options={options}
        style={{ width: 200 }}
        placeholder="Borderless"
        showSearch={{ onSearch: (text) => setOptions(getPanelValue(text)) }}
        onSelect={globalThis.console.log}
        variant="borderless"
      />
      <AutoComplete aria-label="Underlined"
        options={options}
        style={{ width: 200 }}
        placeholder="Underlined"
        onSearch={(text) => setOptions(getPanelValue(text))}
        onSelect={globalThis.console.log}
        variant="underlined"
      />
    </Flex>
  );
};

export default App;
