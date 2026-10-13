import React from 'react';
import { Tooltip } from '@fabi/ui';

const App: React.FC = () => (
  <Tooltip destroyOnHidden title="prompt text">
    <span>Dom will destroyed when Tooltip close</span>
  </Tooltip>
);

export default App;
