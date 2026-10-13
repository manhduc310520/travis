import React from 'react';
import { AutoComplete } from '@fabi/ui';

const options = [
  { value: 'Burns Bay Road' },
  { value: 'Downing Street' },
  { value: 'Wall Street' },
];

const App: React.FC = () => (
  <AutoComplete aria-label="try to type `b`"
    style={{ width: 200 }}
    options={options}
    placeholder="try to type `b`"
    showSearch={{
      filterOption: (inputValue, option) =>
        option!.value.toUpperCase().includes(inputValue.toUpperCase()),
    }}
  />
);

export default App;
