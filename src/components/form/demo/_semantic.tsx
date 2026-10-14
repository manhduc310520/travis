import React from 'react';
import { Form, Input } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element with form item margin-bottom, vertical-align, transitions, hidden states, error/warning states and other basic form item container styles',
    label:
      'Label element with flex layout, overflow hidden, whitespace nowrap, text alignment, vertical alignment, plus label color, font size, height, required marks and other label display styles',
    content:
      'Content element with form content area layout, styling and control container related styles',
    help: 'Help container element with spacing, motion, and presentation styles for help and validation areas',
    helpItem: 'Single help message item with typography styles for prompt, error, and warning text',
    extra:
      'Extra prompt container element with spacing, color, and typography styles for supplementary text',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFields([
      {
        name: 'password',
        errors: ['Please input your password!', 'Use at least 8 characters.'],
      },
    ]);
  }, [form]);

  return (
    <SemanticPreview
      componentName="Form"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'label', desc: locale.label, version: '6.0.0' },
        { name: 'content', desc: locale.content, version: '6.0.0' },
        { name: 'help', desc: locale.help, version: '6.4.0' },
        { name: 'helpItem', desc: locale.helpItem, version: '6.4.0' },
        { name: 'extra', desc: locale.extra, version: '6.4.0' },
      ]}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          help="Use 4 to 16 characters."
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input aria-label="Input" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          extra="Password must contain letters and numbers."
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 8, message: 'Use at least 8 characters.' },
          ]}
        >
          <Input.Password aria-label="Password" />
        </Form.Item>
      </Form>
    </SemanticPreview>
  );
};

export default App;
