import React from 'react';
import { Image } from '@fabi/ui';

const App: React.FC = () => (
  <Image
    width={200}
    alt="basic image"
    preview={{
      imageRender: () => (
        <video
          muted
          width="100%"
          controls
          src="/mock-assets/photo-9.svg"
        />
      ),
      actionsRender: () => null,
    }}
    src="/mock-assets/photo-6.svg"
  />
);

export default App;
