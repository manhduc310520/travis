import React from 'react';
import { Card } from '@fabi/ui';

const App: React.FC = () => (
  <Card
    style={{ width: 300 }}
    cover={<img alt="example" src="/mock-assets/avatar-9.svg" />}
    actions={[<span key="setting">setting</span>, <span key="edit">edit</span>]}
  />
);

export default App;
