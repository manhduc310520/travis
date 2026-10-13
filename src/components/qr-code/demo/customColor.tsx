import React from 'react';
import { QRCode, Space, theme } from '@fabi/ui';

const { useToken } = theme;

const App: React.FC = () => {
  const { token } = useToken();
  return (
    <Space>
      <QRCode aria-label="QR code" value="https://example.com" color={token.colorSuccessText} />
      <QRCode aria-label="QR code"
        value="https://example.com"
        color={token.colorInfoText}
        bgColor={token.colorBgLayout}
      />
    </Space>
  );
};

export default App;
