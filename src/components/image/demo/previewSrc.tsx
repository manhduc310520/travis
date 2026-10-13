import React from 'react';
import { Image } from '@fabi/ui';

const App: React.FC = () => (
  <Image
    width={200}
    alt="basic image"
    src="/mock-assets/photo-3.svg"
    preview={{
      src: '/mock-assets/photo-6.svg',
    }}
  />
);

export default App;
