import React from 'react';
import { SearchOutlined } from '@fabi/ui/icons';
import { AutoComplete, Button, Form, Input, TreeSelect } from '@fabi/ui';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const App: React.FC = () => (
  <Form style={{ margin: '0 auto' }} {...formItemLayout}>
    <Form.Item label="单独 AutoComplete">
      <AutoComplete aria-label="Search" />
    </Form.Item>
    <Form.Item label="单独 TreeSelect">
      <TreeSelect aria-label="Select" />
    </Form.Item>
    <Form.Item label="添加 Input.Group 正常">
      <Input.Group compact>
        <TreeSelect aria-label="Select" style={{ width: '30%' }} />
        <AutoComplete aria-label="Search" />
      </Input.Group>
    </Form.Item>
    <Form.Item label="包含 search 图标正常">
      <AutoComplete aria-label="Search">
        <Input aria-label="Input" suffix={<SearchOutlined />} />
      </AutoComplete>
    </Form.Item>
    <Form.Item label="同时有 Input.Group 和图标发生移位">
      <Input.Group compact>
        <TreeSelect aria-label="Select" style={{ width: '30%' }} />
        <AutoComplete aria-label="Search">
          <Input aria-label="Input" suffix={<SearchOutlined />} />
        </AutoComplete>
      </Input.Group>
    </Form.Item>
    <Form.Item label="同时有 Input.Group 和 Search 组件发生移位">
      <Input.Group compact>
        <TreeSelect aria-label="Select" style={{ width: '30%' }} />
        <AutoComplete aria-label="Search">
          <Input.Search aria-label="Search" />
        </AutoComplete>
      </Input.Group>
    </Form.Item>
    <Form.Item label="Input Group 和 Button 结合">
      <Input.Group compact>
        <TreeSelect aria-label="Select" style={{ width: '20%' }} />
        <AutoComplete aria-label="Search">
          <Input.Search aria-label="Search" />
        </AutoComplete>
        <Button type="primary" icon={<SearchOutlined />}>
          Search
        </Button>
      </Input.Group>
    </Form.Item>
  </Form>
);

export default App;
