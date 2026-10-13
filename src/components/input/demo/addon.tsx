import React from 'react';
import { SettingOutlined } from '@fabi/ui/icons';
import { Cascader, Input, Select, Space } from '@fabi/ui';

const selectBefore = (
  <Select aria-label="Select"
    defaultValue="http://"
    options={[
      { value: 'http://', label: 'http://' },
      { value: 'https://', label: 'https://' },
    ]}
  />
);
const selectAfter = (
  <Select aria-label="Select"
    defaultValue=".com"
    options={[
      { value: '.com', label: '.com' },
      { value: '.jp', label: '.jp' },
      { value: '.cn', label: '.cn' },
      { value: '.org', label: '.org' },
    ]}
  />
);

const App: React.FC = () => (
  <Space vertical>
    <Input aria-label="Input" addonBefore="http://" addonAfter=".com" defaultValue="mysite" />
    <Input aria-label="Input" addonBefore={selectBefore} addonAfter={selectAfter} defaultValue="mysite" />
    <Input aria-label="Input" addonAfter={<SettingOutlined />} defaultValue="mysite" />
    <Input aria-label="Input" addonBefore="http://" suffix=".com" defaultValue="mysite" />
    <Input aria-label="cascader"
      addonBefore={<Cascader aria-label="cascader" placeholder="cascader" style={{ width: 150 }} />}
      defaultValue="mysite"
    />
  </Space>
);

export default App;
