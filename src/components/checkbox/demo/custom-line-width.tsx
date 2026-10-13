import React from 'react';
import { Checkbox, ConfigProvider } from '@fabi/ui';

const App: React.FC = () => (
  <>
    <ConfigProvider
      theme={{
        components: {
          Checkbox: {
            lineWidth: 6,
          },
        },
      }}
    >
      <Checkbox aria-label="Checkbox" checked />
      <Checkbox aria-label="Checkbox" />
    </ConfigProvider>
    <Checkbox aria-label="Checkbox" checked />
    <Checkbox aria-label="Checkbox" />
  </>
);

export default App;
