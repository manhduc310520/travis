import React from 'react';
import { Button, Popover, QRCode } from '@fabi/ui';

const App: React.FC = () => (
  <Popover content={<QRCode aria-label="QR code" value="https://example.com" bordered={false} />}>
    <Button type="primary">Hover me</Button>
  </Popover>
);

export default App;
