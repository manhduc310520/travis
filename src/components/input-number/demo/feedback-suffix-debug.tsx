import React from 'react';
import { Form, InputNumber } from '@fabi/ui';

const App: React.FC = () => (
  <Form layout="vertical" style={{ maxWidth: 320 }}>
    <Form.Item label="Suffix with feedback" validateStatus="success" hasFeedback>
      <InputNumber aria-label="Number" defaultValue={100} suffix="RMB" style={{ width: '100%' }} />
    </Form.Item>
  </Form>
);

export default App;
