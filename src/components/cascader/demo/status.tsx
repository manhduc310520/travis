import React from 'react';
import { Cascader, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space vertical>
    <Cascader aria-label="Error" status="error" placeholder="Error" />
    <Cascader aria-label="Warning multiple" status="warning" multiple placeholder="Warning multiple" />
  </Space>
);

export default App;
