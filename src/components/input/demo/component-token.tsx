import React from 'react';
import { UserOutlined } from '@fabi/ui/icons';
import { ConfigProvider, Input } from '@fabi/ui';

const App: React.FC = () => (
  <>
    <ConfigProvider theme={{ token: { controlHeight: 28 } }}>
      <Input aria-label="Basic usage" placeholder="Basic usage" />
    </ConfigProvider>
    <ConfigProvider
      componentSize="small"
      theme={{ token: {}, components: { Input: { inputFontSizeSM: 12 } } }}
    >
      <Input aria-label="Basic usage" placeholder="Basic usage" />
    </ConfigProvider>
    <ConfigProvider theme={{ components: { Input: { inputFontSize: 10 } } }}>
      <Input aria-label="With prefix" placeholder="With prefix" prefix={<UserOutlined />} />
    </ConfigProvider>
  </>
);

export default App;
