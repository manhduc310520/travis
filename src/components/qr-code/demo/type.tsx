import React from 'react';
import { QRCode, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space>
    <QRCode aria-label="QR code" type="canvas" value="https://example.com" />
    <QRCode aria-label="QR code" type="svg" value="https://example.com" />
  </Space>
);

export default App;
