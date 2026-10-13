import React from 'react';
import { Flex, Typography, theme } from '@fabi/ui';

/** Your own block in theme colours: read the tokens, never paste hex values */
const App: React.FC = () => {
  const { token } = theme.useToken();
  return (
    <Flex
      vertical
      gap="small"
      style={{
        padding: token.padding,
        background: token.colorPrimaryBg,
        border: `${token.lineWidth}px solid ${token.colorPrimaryBorder}`,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Typography.Text strong style={{ color: token.colorPrimaryText }}>Khuyến mãi tháng 10</Typography.Text>
      <Typography.Text>Màu nền, viền, chữ và bo góc lấy từ token, nên đổi brand hay Dark mode là khối này đổi theo.</Typography.Text>
    </Flex>
  );
};

export default App;
