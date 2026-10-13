import React from 'react';
import { Image } from '@fabi/ui';

const App: React.FC = () => (
  <Image.PreviewGroup
    items={[
      '/mock-assets/photo-10.svg',
      '/mock-assets/photo-2.svg',
      '/mock-assets/photo-11.svg',
    ]}
  >
    <Image
      alt="webp image"
      width={200}
      src="/mock-assets/photo-10.svg"
    />
  </Image.PreviewGroup>
);

export default App;
