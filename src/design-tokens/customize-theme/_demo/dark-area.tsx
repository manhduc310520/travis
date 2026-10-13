import React from 'react';
import { Button, FabiProvider, Flex, Typography, theme } from '@fabi/ui';

/** A dark area (e.g. the buttons on the app header): its own tokens come from the nested FabiProvider */
const DarkPanel: React.FC = () => {
  const { token } = theme.useToken();
  return (
    <Flex gap="small" align="center" wrap style={{ padding: token.padding, background: token.colorBgContainer, borderRadius: token.borderRadiusLG }}>
      <Typography.Text>Vùng tối</Typography.Text>
      <Button type="primary">Lưu</Button>
      <Button>Huỷ</Button>
    </Flex>
  );
};

const App: React.FC = () => (
  <Flex vertical gap="middle">
    <Flex gap="small" align="center">
      <Typography.Text>Theo trang</Typography.Text>
      <Button type="primary">Lưu</Button>
    </Flex>
    {/* same brand as the page, Dark mode only inside */}
    <FabiProvider mode="dark">
      <DarkPanel />
    </FabiProvider>
  </Flex>
);

export default App;
