import React from 'react';
import { SmileOutlined } from '@fabi/ui/icons';
import { Button, Result } from '@fabi/ui';

const App: React.FC = () => (
  <Result
    icon={<SmileOutlined />}
    title="Great, we have done all the operations!"
    extra={<Button type="primary">Next</Button>}
  />
);

export default App;
