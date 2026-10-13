import React from 'react';
import { Switch } from '@fabi/ui';

const App: React.FC = () => (
  <>
    <Switch aria-label="Switch" loading defaultChecked />
    <br />
    <Switch aria-label="Switch" size="small" loading />
  </>
);

export default App;
