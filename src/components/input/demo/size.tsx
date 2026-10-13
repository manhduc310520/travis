import React from 'react';
import { UserOutlined } from '@fabi/ui/icons';
import { Flex, Input } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Input aria-label="large size" size="large" placeholder="large size" prefix={<UserOutlined />} />
    <Input aria-label="default size" placeholder="default size" prefix={<UserOutlined />} />
    <Input aria-label="small size" size="small" placeholder="small size" prefix={<UserOutlined />} />
  </Flex>
);

export default App;
