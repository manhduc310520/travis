import React from 'react';
import { ZoomInOutlined } from '@fabi/ui/icons';
import { Image, Space } from '@fabi/ui';

const App: React.FC = () => {
  return (
    <Space size={16}>
      <Image
        width={96}
        alt="basic image"
        src="/mock-assets/photo-6.svg"
        preview={{
          cover: {
            coverNode: (
              <Space align="center">
                <ZoomInOutlined />
                center
              </Space>
            ),
            placement: 'center',
          },
        }}
      />
      <Image
        width={96}
        alt="image"
        src="/mock-assets/photo-6.svg"
        preview={{
          cover: {
            coverNode: (
              <Space align="center">
                <ZoomInOutlined />
                top
              </Space>
            ),
            placement: 'top',
          },
        }}
      />
      <Image
        width={96}
        alt="image"
        src="/mock-assets/photo-6.svg"
        preview={{
          cover: {
            coverNode: (
              <Space align="center">
                <ZoomInOutlined />
                bottom
              </Space>
            ),
            placement: 'bottom',
          },
        }}
      />
    </Space>
  );
};

export default App;
