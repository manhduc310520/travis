import React from 'react';
import { List, Spin } from '@fabi/ui';

const App: React.FC = () => (
  <List
    dataSource={['Apple', 'Banana']}
    renderItem={(item) => <List.Item extra={<Spin size="small" />}>{item}</List.Item>}
  />
);

export default App;
