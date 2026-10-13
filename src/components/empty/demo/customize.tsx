import React from 'react';
import { Button, Empty, Typography } from '@fabi/ui';

const App: React.FC = () => (
  <Empty
    image="/mock-assets/illustration.svg"
    styles={{ image: { height: 60 } }}
    description={
      <Typography.Text>
        Customize <a href="#api">Description</a>
      </Typography.Text>
    }
  >
    <Button type="primary">Create Now</Button>
  </Empty>
);

export default App;
