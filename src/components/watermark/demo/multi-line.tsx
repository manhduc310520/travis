import React from 'react';
import { Watermark } from '@fabi/ui';

const App: React.FC = () => (
  <Watermark content={['FABi CMS', { text: 'Happy Working', font: { fontSize: 12 } }]}>
    <div style={{ height: 500 }} />
  </Watermark>
);

export default App;
