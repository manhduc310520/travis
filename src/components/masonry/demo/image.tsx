import React from 'react';
import { Masonry } from '@fabi/ui';

const imageList = [
  '/mock-assets/photo-8.svg',
  '/mock-assets/photo-4.svg',
  '/mock-assets/photo-6.svg',
  '/mock-assets/photo-6.svg',
  '/mock-assets/photo-12.svg',
  '/mock-assets/photo-7.svg',
  '/mock-assets/photo-12.svg',
  '/mock-assets/photo-5.svg',
  '/mock-assets/photo-10.svg',
  '/mock-assets/photo-5.svg',
  '/mock-assets/photo-5.svg',
  '/mock-assets/photo-1.svg',
  '/mock-assets/photo-7.svg',
  '/mock-assets/photo-9.svg',
  '/mock-assets/photo-11.svg',
  '/mock-assets/photo-11.svg',
];

const App = () => (
  <Masonry
    columns={4}
    gutter={16}
    items={imageList.map((img, index) => ({
      key: `item-${index}`,
      data: img,
    }))}
    itemRender={({ data }) => (
      <img src={`${data}?w=523&auto=format`} alt="sample" style={{ width: '100%' }} />
    )}
  />
);

export default App;
