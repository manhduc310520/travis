import React, { useState } from 'react';
import { ConfigProvider, FloatButton, Slider } from '@fabi/ui';
import type { ConfigProviderProps, GetProp } from '@fabi/ui';

type AliasToken = GetProp<ConfigProviderProps, 'theme'>['token'];

const App: React.FC = () => {
  const [radius, setRadius] = useState<number>(0);

  const token: Partial<AliasToken> = {
    borderRadius: radius,
  };

  return (
    <>
      <Slider ariaLabelForHandle="Slider" min={0} max={20} style={{ margin: 16 }} onChange={setRadius} />
      <ConfigProvider theme={{ token }}>
        <FloatButton shape="square" badge={{ dot: true }} />
      </ConfigProvider>
    </>
  );
};

export default App;
