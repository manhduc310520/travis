import React from 'react';
import {
  AutoComplete,
  Cascader,
  Flex,
  Form,
  Input,
  Select,
  Space,
  TreeSelect,
  Typography,
} from '@fabi/ui';

const options = [
  { value: 'long', label: <Typography>long, long, long piece of text</Typography> },
  { value: 'short', label: <Typography>short</Typography> },
  { value: 'normal', label: <div>normal</div> },
];

const App: React.FC = () => (
  <>
    <Space wrap>
      <Select aria-label="Select"
        defaultValue="long, long, long piece of text"
        style={{ width: 120 }}
        allowClear
        options={options}
      />

      <Select aria-label="Select a option"
        placeholder="Select a option"
        style={{ width: 120, height: 60 }}
        allowClear
        options={options}
      />

      <Select aria-label="Select a option"
        defaultValue="normal"
        placeholder="Select a option"
        style={{ width: 120 }}
        allowClear
        options={options}
      />

      <Select aria-label="Select a option"
        defaultValue={['normal']}
        mode="multiple"
        placeholder="Select a option"
        style={{ width: 120 }}
        allowClear
        options={options}
      />

      <Select aria-label="Select a option"
        mode="multiple"
        placeholder="Select a option"
        style={{ width: 120, height: 60 }}
        allowClear
        options={options}
      />

      <Cascader aria-label="Select a option"
        placeholder="Select a option"
        style={{ width: 120, height: 60 }}
        allowClear
        options={options}
      />

      <TreeSelect aria-label="Please select"
        showSearch
        style={{ width: 120, height: 60 }}
        placeholder="Please select"
        allowClear
        popupMatchSelectWidth={false}
        treeDefaultExpandAll
        treeData={[
          {
            value: 'parent 1',
            title: 'parent 1',
            children: options,
          },
        ]}
      />
      <Select aria-label="Select"
        prefix="Hello World"
        mode="multiple"
        allowClear
        placeholder="Select"
        style={{ minWidth: 200, height: 200 }}
        defaultValue={['long']}
        options={options}
      />
      <Select aria-label="请选择"
        mode="multiple"
        style={{ width: 200 }}
        placeholder="请选择"
        maxTagCount="responsive"
        prefix="城市"
        options={options}
      />
      <Select aria-label="请选择"
        style={{ width: 200 }}
        placeholder="请选择"
        prefix="城市"
        options={options}
        showSearch
        allowClear
        status="error"
      />
      <Select aria-label="Select"
        style={{ width: 100 }}
        prefix="Hi"
        options={options}
        showSearch
        allowClear
        status="warning"
        variant="filled"
        defaultValue="Bamboo"
      />
      <Select aria-label="Select"
        style={{ width: 100 }}
        prefix="Hi"
        options={options}
        showSearch
        allowClear
        status="error"
        variant="borderless"
        defaultValue="Bamboo"
      />
      <Form style={{ width: 200 }} layout="vertical">
        <Form.Item
          label="Label"
          name="bamboo"
          initialValue="Bamboo"
          style={{
            boxShadow: '0 0 0 1px red',
          }}
        >
          <Select aria-label="bamboo" options={options} allowClear placeholder="bamboo" />
        </Form.Item>
        <Form.Item
          label="Label"
          name="bamboo"
          initialValue="Bamboo"
          style={{
            boxShadow: '0 0 0 1px red',
          }}
        >
          <AutoComplete aria-label="bamboo" options={options} allowClear placeholder="bamboo" />
        </Form.Item>
      </Form>
    </Space>

    {/* Test for align */}
    <Flex vertical style={{ width: 200 }}>
      {/* Single */}
      <Input aria-label="Input" prefix="Hi" placeholder="Input" allowClear />
      <Select aria-label="Single" prefix="Hi" placeholder="Single" options={options} allowClear showSearch />
      <Select aria-label="Single"
        prefix="Hi"
        placeholder="Single"
        options={options}
        allowClear
        showSearch
        defaultValue="Bamboo"
      />
      {/* Multiple */}
      <Select aria-label="Multiple" placeholder="Multiple" options={options} allowClear mode="multiple" />
      <Select aria-label="Multiple" prefix="Hi" placeholder="Multiple" options={options} allowClear mode="multiple" />
      <Select aria-label="Multiple"
        prefix="Hi"
        placeholder="Multiple"
        options={options}
        allowClear
        mode="multiple"
        defaultValue={['Bamboo']}
      />
      <Select aria-label="Multiple"
        placeholder="Multiple"
        options={options}
        allowClear
        mode="multiple"
        defaultValue={['Bamboo']}
      />
    </Flex>
  </>
);

export default App;
