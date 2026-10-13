import React from 'react';
import { Flex, QRCode } from '@fabi/ui';

const value = 'https://example.com';

const App: React.FC = () => (
  <Flex gap="medium" wrap>
    <QRCode aria-label="QR code" value={value} status="loading" />
    <QRCode aria-label="QR code" value={value} status="expired" onRefresh={() => console.log('refresh')} />
    <QRCode aria-label="QR code" value={value} status="scanned" />
  </Flex>
);

export default App;
