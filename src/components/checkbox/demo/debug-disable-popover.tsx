import React from 'react';
import { Checkbox, Popover } from '@fabi/ui';

const App: React.FC = () => (
  <div style={{ padding: 56 }}>
    <Popover content="xxxx" trigger="hover">
      <Checkbox aria-label="Checkbox" disabled checked />
    </Popover>
  </div>
);

export default App;
