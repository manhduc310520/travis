import React from 'react';
import { Image } from '@fabi/ui';

const src = '/mock-assets/photo-6.svg';

const App: React.FC = () => (
  <Image
    src={src}
    width="200px"
    height="200px"
    alt="test"
    preview={{
      imageRender: (_, { image }) => <div>{JSON.stringify(image)}</div>,
      actionsRender: (_, { image }) => <div>{JSON.stringify(image)}</div>,
    }}
  />
);

export default App;
