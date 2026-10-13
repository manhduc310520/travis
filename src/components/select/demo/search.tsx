import React from 'react';
import { Select } from '@fabi/ui';

const onChange = (value: string) => {
  console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
  console.log('search:', value);
};

const App: React.FC = () => (
  <Select aria-label="Select a person"
    showSearch={{ optionFilterProp: 'label', onSearch }}
    placeholder="Select a person"
    onChange={onChange}
    options={[
      {
        value: 'jack',
        label: 'Jack',
      },
      {
        value: 'lucy',
        label: 'Lucy',
      },
      {
        value: 'tom',
        label: 'Tom',
      },
    ]}
  />
);

export default App;
