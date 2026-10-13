import React from 'react';
import { Select, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space vertical style={{ width: '100%' }}>
    <Select aria-label="Select" status="error" style={{ width: '100%' }} />
    <Select aria-label="Select" status="warning" style={{ width: '100%' }} />
  </Space>
);

export default App;
