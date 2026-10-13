import React from 'react';
import { Image, Space } from '@fabi/ui';

const App: React.FC = () => {
  return (
    <Space>
      <Image
        width={100}
        alt="blur preview"
        src="/mock-assets/photo-6.svg"
        preview={{
          mask: { blur: true },
          cover: (
            <Space vertical align="center">
              blur
            </Space>
          ),
        }}
      />
      <Image
        alt="Dimmed mask preview"
        width={100}
        src="/mock-assets/illustration.svg"
        preview={{
          cover: (
            <Space vertical align="center">
              Dimmed mask
            </Space>
          ),
        }}
      />
      <Image
        width={100}
        alt="No mask preview"
        src="/mock-assets/illustration.svg"
        preview={{
          mask: false,
          cover: (
            <Space vertical align="center">
              No mask
            </Space>
          ),
        }}
      />
    </Space>
  );
};

export default App;
