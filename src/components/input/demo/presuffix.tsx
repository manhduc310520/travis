import React from 'react';
import { InfoCircleOutlined, LockOutlined, UserOutlined } from '@fabi/ui/icons';
import { Input, Tooltip } from '@fabi/ui';

const App: React.FC = () => (
  <>
    <Input aria-label="Enter your username"
      placeholder="Enter your username"
      prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
      suffix={
        <Tooltip title="Extra information">
          <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
        </Tooltip>
      }
    />
    <br />
    <br />
    <Input aria-label="Input" prefix="₫" suffix="VND" />
    <br />
    <br />
    <Input aria-label="Input" prefix="₫" suffix="VND" disabled />
    <br />
    <br />
    <Input.Password aria-label="input password support suffix"
      suffix={<LockOutlined />} // `suffix` available since `5.27.0`
      placeholder="input password support suffix"
    />
  </>
);

export default App;
