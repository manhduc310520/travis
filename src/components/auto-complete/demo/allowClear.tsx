import React, { useState } from 'react';
import { CloseSquareFilled } from '@fabi/ui/icons';
import { AutoComplete } from '@fabi/ui';
import type { AutoCompleteProps } from '@fabi/ui';

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

const App: React.FC = () => {
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);

  const getPanelValue = (searchText: string) =>
    !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];

  return (
    <>
      <AutoComplete aria-label="UnClearable"
        options={options}
        style={{ width: 200 }}
        showSearch={{ onSearch: (text) => setOptions(getPanelValue(text)) }}
        placeholder="UnClearable"
        allowClear={false}
      />
      <br />
      <br />
      <AutoComplete aria-label="Customized clear icon"
        options={options}
        style={{ width: 200 }}
        showSearch={{ onSearch: (text) => setOptions(getPanelValue(text)) }}
        placeholder="Customized clear icon"
        allowClear={{ clearIcon: <CloseSquareFilled /> }}
      />
    </>
  );
};

export default App;
