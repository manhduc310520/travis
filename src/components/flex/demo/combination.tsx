import React from 'react';
import { Button, Card, Flex, Typography } from '@fabi/ui';

const cardStyle: React.CSSProperties = {
  width: 620,
};

const imgStyle: React.CSSProperties = {
  display: 'block',
  width: 273,
};

const App: React.FC = () => (
  <Card hoverable style={cardStyle} styles={{ body: { padding: 0, overflow: 'hidden' } }}>
    <Flex justify="space-between">
      <img
        draggable={false}
        alt="avatar"
        src="/mock-assets/photo-6.svg"
        style={imgStyle}
      />
      <Flex vertical align="flex-end" justify="space-between" style={{ padding: 32 }}>
        <Typography.Title level={3}>
          “FABi CMS keeps the menus, orders and staff of every branch in one place.”
        </Typography.Title>
        <Button type="primary" href="https://example.com" target="_blank">
          Get Started
        </Button>
      </Flex>
    </Flex>
  </Card>
);

export default App;
