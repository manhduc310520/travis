import React from 'react';
import { MehOutlined, SmileOutlined } from '@fabi/ui/icons';
import { Select, Space } from '@fabi/ui';

const smileIcon = <SmileOutlined />;
const mehIcon = <MehOutlined />;

const handleChange = (value: string | string[]) => {
  console.log(`selected ${value}`);
};

const App: React.FC = () => (
  <Space wrap>
    <Select aria-label="Select User"
      prefix="User"
      defaultValue="lucy"
      placeholder="Select User"
      style={{ width: 200 }}
      onChange={handleChange}
      options={[
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'Yiminghe', label: 'yiminghe' },
        { value: 'disabled', label: 'Disabled', disabled: true },
      ]}
      allowClear
      showSearch
    />
    <Select aria-label="Select"
      suffixIcon={smileIcon}
      defaultValue="lucy"
      placeholder="Select"
      style={{ width: 120 }}
      onChange={handleChange}
      options={[
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'Yiminghe', label: 'yiminghe' },
        { value: 'disabled', label: 'Disabled', disabled: true },
      ]}
    />
    <Select aria-label="Select"
      suffixIcon={mehIcon}
      defaultValue="lucy"
      placeholder="Select"
      style={{ width: 120 }}
      disabled
      options={[{ value: 'lucy', label: 'Lucy' }]}
    />
    <br />
    <Select aria-label="Select"
      prefix="User"
      defaultValue={['lucy']}
      placeholder="Select"
      mode="multiple"
      style={{ width: 200 }}
      onChange={handleChange}
      options={[
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'Yiminghe', label: 'yiminghe' },
        { value: 'disabled', label: 'Disabled', disabled: true },
      ]}
    />
    <Select aria-label="Select"
      suffixIcon={smileIcon}
      defaultValue={['lucy']}
      placeholder="Select"
      mode="multiple"
      style={{ width: 120 }}
      onChange={handleChange}
      options={[
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'Yiminghe', label: 'yiminghe' },
        { value: 'disabled', label: 'Disabled', disabled: true },
      ]}
    />
    <Select aria-label="Select"
      suffixIcon={mehIcon}
      defaultValue={['lucy']}
      placeholder="Select"
      mode="multiple"
      style={{ width: 120 }}
      disabled
      options={[{ value: 'lucy', label: 'Lucy' }]}
    />
  </Space>
);

export default App;
