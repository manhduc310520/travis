import React from 'react';
import { Image } from '@fabi/ui';

const App: React.FC = () => (
  <Image.PreviewGroup
    preview={{
      onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
    }}
  >
    <Image
      alt="svg image"
      width={200}
      src="/mock-assets/illustration.svg"
    />
    <Image
      width={200}
      alt="svg image"
      src="/mock-assets/illustration.svg"
    />
  </Image.PreviewGroup>
);

export default App;
