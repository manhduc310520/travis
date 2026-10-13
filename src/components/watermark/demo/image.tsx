import React from 'react';
import { Watermark } from '@fabi/ui';

const App: React.FC = () => (
  <Watermark
    height={30}
    width={130}
    image="/mock-assets/photo-11.svg"
  >
    <div style={{ height: 500 }} />
  </Watermark>
);

export default App;
