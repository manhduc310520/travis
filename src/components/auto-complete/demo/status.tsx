import React, { useState } from 'react';
import { AutoComplete, Space } from '@fabi/ui';
import type { AutoCompleteProps } from '@fabi/ui';

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

const App: React.FC = () => {
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  const [anotherOptions, setAnotherOptions] = useState<AutoCompleteProps['options']>([]);

  const getPanelValue = (searchText: string) =>
    !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];

  return (
    <Space vertical style={{ width: '100%' }}>
      <AutoComplete aria-label="Search"
        options={options}
        showSearch={{
          onSearch: (text) => setOptions(getPanelValue(text)),
        }}
        status="error"
        style={{ width: 200 }}
      />
      <AutoComplete aria-label="Search"
        options={anotherOptions}
        showSearch={{
          onSearch: (text) => setAnotherOptions(getPanelValue(text)),
        }}
        status="warning"
        style={{ width: 200 }}
      />
    </Space>
  );
};

export default App;
