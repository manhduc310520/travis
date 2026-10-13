import React from 'react';
import { AppstoreOutlined } from '@fabi/ui/icons';
import { Avatar } from '@fabi/ui';

const App: React.FC = () => (
  <Avatar
    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
    icon={<AppstoreOutlined />}
  />
);

export default App;
