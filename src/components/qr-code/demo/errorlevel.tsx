import React, { useState } from 'react';
import type { QRCodeProps } from '@fabi/ui';
import { QRCode, Segmented } from '@fabi/ui';

const App: React.FC = () => {
  const [level, setLevel] = useState<QRCodeProps['errorLevel']>('L');
  return (
    <>
      <QRCode aria-label="QR code"
        style={{ marginBottom: 16 }}
        errorLevel={level}
        value="/mock-assets/illustration.svg"
      />
      <Segmented options={['L', 'M', 'Q', 'H']} value={level} onChange={setLevel} />
    </>
  );
};

export default App;
