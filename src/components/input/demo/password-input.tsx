import React from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@fabi/ui/icons';
import { Button, Input, Space } from '@fabi/ui';

const App: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  return (
    <Space vertical>
      <Input.Password aria-label="input password" placeholder="input password" />
      <Input.Password aria-label="input password"
        placeholder="input password"
        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
      <Space>
        <Input.Password aria-label="input password"
          placeholder="input password"
          visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
        />
        <Button style={{ width: 80 }} onClick={() => setPasswordVisible((prevState) => !prevState)}>
          {passwordVisible ? 'Hide' : 'Show'}
        </Button>
      </Space>
      <Input.Password aria-label="disabled input password" disabled placeholder="disabled input password" />
    </Space>
  );
};

export default App;
