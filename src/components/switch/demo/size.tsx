import React from 'react';
import { Switch } from '@fabi/ui';

const App: React.FC = () => (
  <>
    <Switch aria-label="Switch" defaultChecked />
    <br />
    <Switch aria-label="Switch" size="small" defaultChecked />
  </>
);

export default App;
