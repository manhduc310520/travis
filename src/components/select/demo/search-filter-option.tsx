import React from 'react';
import { Select } from '@fabi/ui';

const App: React.FC = () => (
  <Select aria-label="Select a person"
    showSearch={{
      filterOption: (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
    }}
    placeholder="Select a person"
    options={[
      { value: '1', label: 'Jack' },
      { value: '2', label: 'Lucy' },
      { value: '3', label: 'Tom' },
    ]}
  />
);

export default App;
