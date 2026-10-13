import React from 'react';
import { ConfigProvider, Flex, Input, Typography } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap="large">
    <Flex vertical gap="small">
      <Typography.Text strong>Input.Search</Typography.Text>
      <Typography.Text code>ConfigProvider input</Typography.Text>
      <ConfigProvider input={{ variant: 'filled' }}>
        <Input.Search aria-label="Filled" placeholder="Filled" />
      </ConfigProvider>
      <Typography.Text code>ConfigProvider inputSearch</Typography.Text>
      <ConfigProvider inputSearch={{ variant: 'filled' }}>
        <Input.Search aria-label="Filled" placeholder="Filled" />
      </ConfigProvider>
      <Typography.Text code>Component prop</Typography.Text>
      <Input.Search aria-label="Filled" placeholder="Filled" variant="filled" />
    </Flex>

    <Flex vertical gap="small">
      <Typography.Text strong>Input.Password</Typography.Text>
      <Typography.Text code>ConfigProvider input</Typography.Text>
      <ConfigProvider input={{ variant: 'filled' }}>
        <Input.Password aria-label="Filled" placeholder="Filled" />
      </ConfigProvider>
      <Typography.Text code>ConfigProvider inputPassword</Typography.Text>
      <ConfigProvider inputPassword={{ variant: 'filled' }}>
        <Input.Password aria-label="Filled" placeholder="Filled" />
      </ConfigProvider>
      <Typography.Text code>Component prop</Typography.Text>
      <Input.Password aria-label="Filled" placeholder="Filled" variant="filled" />
    </Flex>

    <Flex vertical gap="small">
      <Typography.Text strong>Input.OTP</Typography.Text>
      <Typography.Text code>ConfigProvider input</Typography.Text>
      <ConfigProvider input={{ variant: 'filled' }}>
        <Input.OTP aria-label="One-time code" defaultValue="111111" />
      </ConfigProvider>
      <Typography.Text code>ConfigProvider otp</Typography.Text>
      <ConfigProvider otp={{ variant: 'filled' }}>
        <Input.OTP aria-label="One-time code" defaultValue="222222" />
      </ConfigProvider>
      <Typography.Text code>Component prop</Typography.Text>
      <Input.OTP aria-label="One-time code" defaultValue="333333" variant="filled" />
    </Flex>
  </Flex>
);

export default App;
