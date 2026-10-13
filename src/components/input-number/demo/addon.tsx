import React from 'react';
import { SettingOutlined } from '@fabi/ui/icons';
import { Cascader, InputNumber, Select, Space } from '@fabi/ui';

const selectBefore = (
  <Select aria-label="Select"
    defaultValue="add"
    style={{ width: 60 }}
    options={[
      { label: '+', value: 'add' },
      { label: '-', value: 'minus' },
    ]}
  />
);

const selectAfter = (
  <Select aria-label="Select"
    defaultValue="USD"
    style={{ width: 60 }}
    options={[
      { label: '$', value: 'USD' },
      { label: '€', value: 'EUR' },
      { label: '£', value: 'GBP' },
      { label: '¥', value: 'CNY' },
    ]}
  />
);

const App: React.FC = () => (
  <Space vertical>
    <InputNumber aria-label="Number" addonBefore="+" addonAfter="$" defaultValue={100} />
    <InputNumber aria-label="Number" addonBefore={selectBefore} addonAfter={selectAfter} defaultValue={100} />
    <InputNumber aria-label="Number" addonAfter={<SettingOutlined />} defaultValue={100} />
    <InputNumber aria-label="cascader"
      addonBefore={<Cascader aria-label="cascader" placeholder="cascader" style={{ width: 150 }} />}
      defaultValue={100}
    />
    <InputNumber aria-label="Number"
      addonBefore="+"
      addonAfter={<SettingOutlined />}
      defaultValue={100}
      disabled
      controls
    />
    <InputNumber aria-label="Number"
      prefix="¥"
      addonBefore="+"
      addonAfter={<SettingOutlined />}
      defaultValue={100}
      disabled
      controls
    />
  </Space>
);

export default App;
