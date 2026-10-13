import React from 'react';
import { Button, Flex, Input, Select, Space } from '@fabi/ui';

const style: React.CSSProperties = {
  width: 500,
  position: 'relative',
  zIndex: 1,
  border: '1px solid red',
  backgroundColor: '#fff',
};

const handleChange = (value: string | string[]) => {
  console.log(`selected ${value}`);
};

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Space style={style} wrap>
      <Input aria-label="Input" style={{ width: 100 }} value="222" />
      <Select aria-label="233"
        style={{ width: 120 }}
        onChange={handleChange}
        showSearch
        placeholder="233"
        options={[
          { value: 'jack', label: 'Jack' },
          { value: 'lucy', label: 'Lucy' },
          { value: 'disabled', disabled: true, label: 'Disabled' },
          { value: 'Yiminghe', label: 'yiminghe' },
          { value: 'long', label: 'I am super super long!' },
        ]}
      />
      <Select aria-label="233"
        mode="multiple"
        style={{ width: 120 }}
        defaultValue={['lucy']}
        onChange={handleChange}
        showSearch
        placeholder="233"
        options={[
          { value: 'jack', label: 'Jack' },
          { value: 'lucy', label: 'Lucy' },
          { value: 'disabled', disabled: true, label: 'Disabled' },
          { value: 'Yiminghe', label: 'yiminghe' },
          { value: 'long', label: 'I am super super long!' },
        ]}
      />
      <span className="debug-align">AntDesign</span>
      <Button>222</Button>
      {/* https://example.com */}
      <Select aria-label="Please select"
        style={{ width: 120 }}
        defaultValue=" "
        placeholder="Please select"
        options={[
          { value: 'jack', label: 'Jack' },
          { value: 'lucy', label: 'Lucy' },
          { value: 'disabled', disabled: true, label: 'Disabled' },
          { value: 'Yiminghe', label: 'yiminghe' },
          { value: 'long', label: 'I am super super long!' },
        ]}
      />
    </Space>
    <div style={{ width: 200 }}>
      {/* https://example.com */}
      <Select aria-label="Select"
        mode="multiple"
        style={{ width: '100%' }}
        defaultValue={[1]}
        options={[
          {
            value: 1,
            label: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
          },
        ]}
      />
    </div>

    <Select aria-label="Select" defaultValue="" />
  </Flex>
);

export default App;
