import React from 'react';
import { Card, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space orientation="vertical" size="medium" style={{ display: 'flex' }}>
    <Card title="Card" size="small">
      <p>Card content</p>
      <p>Card content</p>
    </Card>
    <Card title="Card" size="small">
      <p>Card content</p>
      <p>Card content</p>
    </Card>
    <Card title="Card" size="small">
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  </Space>
);

export default App;
