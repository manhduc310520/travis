import React from 'react';
import { Breadcrumb } from '@fabi/ui';

const App: React.FC = () => {
  return (
    <Breadcrumb
      items={[
        {
          title: 'Home',
        },
        {
          title: <a href="">Application Center</a>,
        },
        {
          title: <a href="">Application List</a>,
        },
        {
          title: 'An Application',
        },
      ]}
    />
  );
};

export default App;
