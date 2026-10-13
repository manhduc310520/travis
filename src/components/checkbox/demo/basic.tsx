import React from 'react';
import { Checkbox } from '@fabi/ui';
import type { CheckboxProps } from '@fabi/ui';

const onChange: CheckboxProps['onChange'] = (e) => {
  console.log(`checked = ${e.target.checked}`);
};

const App: React.FC = () => <Checkbox onChange={onChange}>Checkbox</Checkbox>;

export default App;
