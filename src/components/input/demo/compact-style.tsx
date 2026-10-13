import React from 'react';
import { SearchOutlined } from '@fabi/ui/icons';
import { Button, Input, Select, Space } from '@fabi/ui';

const { Search } = Input;

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
  },
];

const App: React.FC = () => (
  <Space vertical size="medium">
    <Space.Compact>
      <Input aria-label="Input" defaultValue="26888888" />
    </Space.Compact>
    <Space.Compact>
      <Input aria-label="Input" style={{ width: '20%' }} defaultValue="0571" />
      <Input aria-label="Input" style={{ width: '80%' }} defaultValue="26888888" />
    </Space.Compact>
    <Space.Compact>
      <Space.Addon>https://</Space.Addon>
      <Search placeholder="input search text" allowClear />
    </Space.Compact>
    <Space.Compact style={{ width: '100%' }}>
      <Input aria-label="Input" defaultValue="Combine input and button" />
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <Space.Compact>
      <Select aria-label="Select" defaultValue="Zhejiang" options={options} />
      <Input aria-label="Input" defaultValue="Xihu District, Hangzhou" />
    </Space.Compact>
    <Space.Compact size="large">
      <Space.Addon>
        <SearchOutlined />
      </Space.Addon>
      <Input aria-label="large size" placeholder="large size" />
      <Input aria-label="another input" placeholder="another input" />
    </Space.Compact>
  </Space>
);

export default App;
