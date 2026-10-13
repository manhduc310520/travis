import React from 'react';
import { Space, TreeSelect } from '@fabi/ui';

const App: React.FC = () => (
  <Space vertical style={{ width: '100%' }}>
    <TreeSelect aria-label="Error" status="error" style={{ width: '100%' }} placeholder="Error" />
    <TreeSelect aria-label="Warning multiple"
      status="warning"
      style={{ width: '100%' }}
      multiple
      placeholder="Warning multiple"
    />
  </Space>
);

export default App;
