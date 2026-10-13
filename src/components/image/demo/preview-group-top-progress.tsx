import React from 'react';
import { Image } from '@fabi/ui';

const App: React.FC = () => (
  <Image.PreviewGroup
    preview={{ countRender: (current, total) => `Current ${current} / Total ${total}` }}
  >
    <Image
      alt="svg image"
      width={150}
      src="/mock-assets/illustration.svg"
    />
    <Image
      width={150}
      alt="svg image"
      src="/mock-assets/illustration.svg"
    />
    <Image
      width={150}
      alt="svg image"
      src="/mock-assets/photo-6.svg"
    />
  </Image.PreviewGroup>
);

export default App;
