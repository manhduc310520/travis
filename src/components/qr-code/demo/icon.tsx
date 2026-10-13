import React from 'react';
import { QRCode } from '@fabi/ui';

const App: React.FC = () => (
  <QRCode aria-label="QR code"
    errorLevel="H"
    value="https://example.com"
    icon="/mock-assets/illustration.svg"
  />
);

export default App;
