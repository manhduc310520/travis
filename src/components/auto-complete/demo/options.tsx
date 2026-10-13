import React from 'react';
import { AutoComplete } from '@fabi/ui';
import type { AutoCompleteProps } from '@fabi/ui';

const App: React.FC = () => {
  const [options, setOptions] = React.useState<AutoCompleteProps['options']>([]);
  const handleSearch = (value: string) => {
    setOptions(() => {
      if (!value || value.includes('@')) {
        return [];
      }
      return ['gmail.com', '163.com', 'qq.com'].map((domain) => ({
        label: `${value}@${domain}`,
        value: `${value}@${domain}`,
      }));
    });
  };
  return (
    <AutoComplete aria-label="input here"
      style={{ width: 200 }}
      showSearch={{ onSearch: handleSearch }}
      placeholder="input here"
      options={options}
    />
  );
};

export default App;
