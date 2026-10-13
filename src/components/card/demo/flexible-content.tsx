import React from 'react';
import { Card } from '@fabi/ui';

const { Meta } = Card;

const App: React.FC = () => (
  <Card
    hoverable
    variant="borderless"
    style={{ width: 240 }}
    cover={
      <img
        draggable={false}
        alt="example"
        src="/mock-assets/photo-7.svg"
      />
    }
  >
    <Meta title="Europe Street beat" description="www.instagram.com" />
  </Card>
);

export default App;
