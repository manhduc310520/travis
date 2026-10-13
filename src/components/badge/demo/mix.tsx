import React from 'react';
import { Avatar, Badge, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space size="medium" wrap>
    <Space size="medium" wrap>
      <Badge count={5} status="success">
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={5} status="warning">
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={5} color="blue">
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={5} color="#ad2102">
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge dot status="success">
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge dot status="warning">
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge dot status="processing">
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge dot color="blue">
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge dot color="#ad2102">
        <Avatar shape="square" size="large" />
      </Badge>
    </Space>

    <Space size="medium" wrap>
      <Badge count={0} showZero />
      <Badge count={0} showZero color="blue" />
      <Badge count={0} showZero color="#f0f" />
      <Badge count={0} showZero>
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={0} showZero color="blue">
        <Avatar shape="square" size="large" />
      </Badge>
      <Badge count={0} color="#f0f" />
      <Badge status="success" text={0} showZero />
      <Badge status="warning" text={0} />
    </Space>
  </Space>
);

export default App;
