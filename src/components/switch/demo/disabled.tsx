import React, { useState } from 'react';
import { Button, Space, Switch } from '@fabi/ui';

const App: React.FC = () => {
  const [disabled, setDisabled] = useState(true);

  const toggle = () => {
    setDisabled(!disabled);
  };

  return (
    <Space vertical>
      <Switch aria-label="Switch" disabled={disabled} defaultChecked />
      <Button type="primary" onClick={toggle}>
        Toggle disabled
      </Button>
    </Space>
  );
};

export default App;
