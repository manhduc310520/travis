import React from 'react';
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Segmented,
  Select,
  TreeSelect,
} from '@fabi/ui';

const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const App: React.FC = () => {
  const [form] = Form.useForm();
  const variant = Form.useWatch('variant', form);
  return (
    <Form
      {...formItemLayout}
      form={form}
      variant={variant || 'filled'}
      style={{ maxWidth: 600 }}
      initialValues={{ variant: 'filled' }}
    >
      <Form.Item label="Form variant" name="variant">
        <Segmented options={['outlined', 'filled', 'borderless', 'underlined']} />
      </Form.Item>

      <Form.Item label="Input" name="Input" rules={[{ required: true, message: 'Please input!' }]}>
        <Input aria-label="Input" />
      </Form.Item>

      <Form.Item
        label="InputNumber"
        name="InputNumber"
        rules={[{ required: true, message: 'Please input!' }]}
      >
        <InputNumber aria-label="Number" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="TextArea"
        name="TextArea"
        rules={[{ required: true, message: 'Please input!' }]}
      >
        <Input.TextArea aria-label="Text" />
      </Form.Item>

      <Form.Item
        label="Mentions"
        name="Mentions"
        rules={[{ required: true, message: 'Please input!' }]}
      >
        <Mentions aria-label="Mention" />
      </Form.Item>

      <Form.Item
        label="Select"
        name="Select"
        rules={[{ required: true, message: 'Please input!' }]}
      >
        <Select aria-label="Select" />
      </Form.Item>

      <Form.Item
        label="Cascader"
        name="Cascader"
        rules={[{ required: true, message: 'Please input!' }]}
      >
        <Cascader aria-label="Select" />
      </Form.Item>

      <Form.Item
        label="TreeSelect"
        name="TreeSelect"
        rules={[{ required: true, message: 'Please input!' }]}
      >
        <TreeSelect aria-label="Select" />
      </Form.Item>

      <Form.Item
        label="DatePicker"
        name="DatePicker"
        rules={[{ required: true, message: 'Please input!' }]}
      >
        <DatePicker aria-label="Date" />
      </Form.Item>

      <Form.Item
        label="RangePicker"
        name="RangePicker"
        rules={[{ required: true, message: 'Please input!' }]}
      >
        <RangePicker aria-label="Date range" />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
