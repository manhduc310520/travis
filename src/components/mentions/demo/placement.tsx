import React from 'react';
import { Mentions } from '@fabi/ui';

const App: React.FC = () => (
  <Mentions aria-label="Mention"
    style={{ width: '100%' }}
    placement="top"
    options={[
      {
        value: 'afc163',
        label: 'afc163',
      },
      {
        value: 'zombieJ',
        label: 'zombieJ',
      },
      {
        value: 'yesmeck',
        label: 'yesmeck',
      },
    ]}
  />
);

export default App;
