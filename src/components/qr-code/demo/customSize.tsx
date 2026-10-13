import React, { useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@fabi/ui/icons';
import { Button, QRCode, Space } from '@fabi/ui';

const MIN_SIZE = 48;
const MAX_SIZE = 300;

const App: React.FC = () => {
  const [size, setSize] = useState<number>(160);

  const increase = () => {
    setSize((prevSize) => {
      const newSize = prevSize + 10;
      if (newSize >= MAX_SIZE) {
        return MAX_SIZE;
      }
      return newSize;
    });
  };

  const decline = () => {
    setSize((prevSize) => {
      const newSize = prevSize - 10;
      if (newSize <= MIN_SIZE) {
        return MIN_SIZE;
      }
      return newSize;
    });
  };

  return (
    <>
      <Space.Compact style={{ marginBottom: 16 }}>
        <Button onClick={decline} disabled={size <= MIN_SIZE} icon={<MinusOutlined />}>
          Smaller
        </Button>
        <Button onClick={increase} disabled={size >= MAX_SIZE} icon={<PlusOutlined />}>
          Larger
        </Button>
      </Space.Compact>
      <QRCode aria-label="QR code"
        errorLevel="H"
        size={size}
        iconSize={size / 4}
        value="https://example.com"
        icon="/mock-assets/illustration.svg"
      />
    </>
  );
};

export default App;
