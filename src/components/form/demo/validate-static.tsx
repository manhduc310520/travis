import React from 'react';
import { SmileOutlined } from '@fabi/ui/icons';
import {
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Select,
  TimePicker,
  TreeSelect,
} from '@fabi/ui';

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

const App: React.FC = () => (
  <Form {...formItemLayout} style={{ maxWidth: 600 }}>
    <Form.Item
      label="Fail"
      validateStatus="error"
      help="Should be combination of numbers & alphabets"
    >
      <Input placeholder="unavailable choice" id="error" />
    </Form.Item>

    <Form.Item label="Warning" validateStatus="warning">
      <Input placeholder="Warning" id="warning" prefix={<SmileOutlined />} />
    </Form.Item>

    <Form.Item
      label="Validating"
      hasFeedback
      validateStatus="validating"
      help="The information is being validated..."
    >
      <Input placeholder="I'm the content is being validated" id="validating" />
    </Form.Item>

    <Form.Item label="Success" hasFeedback validateStatus="success">
      <Input placeholder="I'm the content" id="success" />
    </Form.Item>

    <Form.Item label="Warning" hasFeedback validateStatus="warning">
      <Input placeholder="Warning" id="warning2" />
    </Form.Item>

    <Form.Item
      label="Fail"
      hasFeedback
      validateStatus="error"
      help="Should be combination of numbers & alphabets"
    >
      <Input placeholder="unavailable choice" id="error2" />
    </Form.Item>

    <Form.Item label="Success" hasFeedback validateStatus="success">
      <DatePicker aria-label="Date" style={{ width: '100%' }} />
    </Form.Item>

    <Form.Item label="Warning" hasFeedback validateStatus="warning">
      <TimePicker aria-label="Time" style={{ width: '100%' }} />
    </Form.Item>

    <Form.Item label="Error" hasFeedback validateStatus="error">
      <DatePicker.RangePicker aria-label="Date range" style={{ width: '100%' }} />
    </Form.Item>

    <Form.Item label="Error" hasFeedback validateStatus="error">
      <Select aria-label="I'm Select"
        allowClear
        placeholder="I'm Select"
        defaultValue={'1'}
        options={[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
          { label: 'Option 3', value: '3' },
        ]}
      />
    </Form.Item>

    <Form.Item
      label="Validating"
      hasFeedback
      validateStatus="error"
      help="Something breaks the rule."
    >
      <Cascader aria-label="I'm Cascader" placeholder="I'm Cascader" options={[{ value: 'xx', label: 'xx' }]} allowClear />
    </Form.Item>

    <Form.Item label="Warning" hasFeedback validateStatus="warning" help="Need to be checked">
      <TreeSelect aria-label="I'm TreeSelect"
        placeholder="I'm TreeSelect"
        treeData={[{ value: 'xx', label: 'xx' }]}
        allowClear
      />
    </Form.Item>

    <Form.Item label="inline" style={{ marginBottom: 0 }}>
      <Form.Item
        validateStatus="error"
        help="Please select right date"
        style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
      >
        <DatePicker aria-label="Date" />
      </Form.Item>
      <span
        style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}
      >
        -
      </span>
      <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
        <DatePicker aria-label="Date" />
      </Form.Item>
    </Form.Item>

    <Form.Item label="Success" hasFeedback validateStatus="success">
      <InputNumber aria-label="Number" style={{ width: '100%' }} />
    </Form.Item>

    <Form.Item label="Success" hasFeedback validateStatus="success">
      <Input aria-label="with allowClear" allowClear placeholder="with allowClear" />
    </Form.Item>

    <Form.Item label="Warning" hasFeedback validateStatus="warning">
      <Input.Password aria-label="with input password" placeholder="with input password" />
    </Form.Item>

    <Form.Item label="Error" hasFeedback validateStatus="error">
      <Input.Password aria-label="with input password and allowClear" allowClear placeholder="with input password and allowClear" />
    </Form.Item>

    <Form.Item label="Success" hasFeedback validateStatus="success">
      <Input.OTP aria-label="One-time code" />
    </Form.Item>
    <Form.Item label="Warning" hasFeedback validateStatus="warning">
      <Input.OTP aria-label="One-time code" />
    </Form.Item>

    <Form.Item label="Error" hasFeedback validateStatus="error">
      <Input.OTP aria-label="One-time code" />
    </Form.Item>

    <Form.Item label="Fail" validateStatus="error" hasFeedback>
      <Mentions aria-label="Mention" />
    </Form.Item>

    <Form.Item label="Fail" validateStatus="error" hasFeedback help="Should have something">
      <Input.TextArea aria-label="Text" allowClear showCount />
    </Form.Item>
  </Form>
);

export default App;
