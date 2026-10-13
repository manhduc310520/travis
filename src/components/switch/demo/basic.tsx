import React from 'react';
import { Switch } from '@fabi/ui';

const onChange = (checked: boolean) => {
  console.log(`switch to ${checked}`);
};

const App: React.FC = () => <Switch aria-label="Switch" defaultChecked onChange={onChange} />;

export default App;
