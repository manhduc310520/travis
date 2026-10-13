import React, { useEffect, useState } from 'react';
import { LockOutlined, UserOutlined } from '@fabi/ui/icons';
import { Button, Form, Input } from '@fabi/ui';

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [clientReady, setClientReady] = useState<boolean>(false);

  // To disable submit button at the beginning.
  useEffect(() => {
    setClientReady(true);
  }, []);

  const onFinish = (values: any) => {
    console.log('Finish:', values);
  };

  return (
    <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input aria-label="Username" prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input aria-label="Password" prefix={<LockOutlined />} type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item shouldUpdate>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !clientReady ||
              !form.isFieldsTouched(true) ||
              form.getFieldsError().some(({ errors }) => errors.length)
            }
          >
            Log in
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default App;
