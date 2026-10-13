import React from 'react';
import { ConfigProvider, Image } from '@fabi/ui';

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      components: {
        Image: {
          previewOperationSize: 20,
          previewOperationColor: '#222',
          previewOperationColorDisabled: '#b20000',
        },
      },
    }}
  >
    <Image.PreviewGroup
      preview={{ countRender: (current, total) => `Current ${current} / Total ${total}` }}
    >
      <Image
        width={150}
        alt="svg image"
        src="/mock-assets/illustration.svg"
      />
      <Image
        width={150}
        alt="basic image"
        src="/mock-assets/photo-6.svg"
      />
    </Image.PreviewGroup>
  </ConfigProvider>
);

export default App;
