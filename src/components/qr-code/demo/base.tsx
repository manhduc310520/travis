import React from 'react';
import { Input, QRCode, Space } from '@fabi/ui';

const App: React.FC = () => {
  const [text, setText] = React.useState('https://example.com');

  return (
    <Space vertical align="center">
      <QRCode aria-label="QR code" value={text || '-'} />
      <Input aria-label="-"
        placeholder="-"
        maxLength={60}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </Space>
  );
};

export default App;
