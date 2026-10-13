import React from 'react';
import { Select } from '@fabi/ui';

const handleChange = (value: { value: string; label: React.ReactNode }) => {
  console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
};

const App: React.FC = () => (
  <Select aria-label="Select"
    labelInValue
    defaultValue={{ value: 'lucy', label: 'Lucy (101)' }}
    style={{ width: 120 }}
    onChange={handleChange}
    options={[
      {
        value: 'jack',
        label: 'Jack (100)',
      },
      {
        value: 'lucy',
        label: 'Lucy (101)',
      },
    ]}
  />
);

export default App;
