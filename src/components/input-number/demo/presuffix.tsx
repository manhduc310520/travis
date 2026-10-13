import React from 'react';
import { UserOutlined } from '@fabi/ui/icons';
import { Flex, InputNumber, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <InputNumber aria-label="Number" prefix="￥" style={{ width: '100%' }} />

    <Space.Compact block>
      <Space.Addon>
        <UserOutlined />
      </Space.Addon>
      <InputNumber aria-label="Number" prefix="￥" style={{ width: '100%' }} />
    </Space.Compact>

    <InputNumber aria-label="Number" prefix="￥" disabled style={{ width: '100%' }} />

    <InputNumber aria-label="Number" suffix="RMB" style={{ width: '100%' }} />
  </Flex>
);

export default App;
