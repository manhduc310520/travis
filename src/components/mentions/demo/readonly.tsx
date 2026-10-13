import React from 'react';
import { Mentions } from '@fabi/ui';

const options = ['afc163', 'zombiej', 'yesmeck'].map((value) => ({
  value,
  key: value,
  label: value,
}));

const App: React.FC = () => (
  <>
    <div style={{ marginBottom: 10 }}>
      <Mentions aria-label="this is disabled Mentions"
        style={{ width: '100%' }}
        placeholder="this is disabled Mentions"
        disabled
        options={options}
      />
    </div>
    <Mentions aria-label="this is readOnly Mentions"
      style={{ width: '100%' }}
      placeholder="this is readOnly Mentions"
      readOnly
      options={options}
    />
  </>
);

export default App;
