import React from 'react';
import { SettingOutlined } from '@fabi/ui/icons';
import { Button, Input, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space vertical>
    Input addon Button:
    <Input aria-label="Input" addonAfter={<Button type="primary">Submit</Button>} defaultValue="mysite" />
    <Input aria-label="Input" addonAfter={<Button>Submit</Button>} defaultValue="mysite" />
    <br />
    <br />
    Input addon Button icon:
    <Input aria-label="Input"
      addonAfter={
        <Button>
          <SettingOutlined />
        </Button>
      }
      defaultValue="mysite"
    />
  </Space>
);

export default App;
