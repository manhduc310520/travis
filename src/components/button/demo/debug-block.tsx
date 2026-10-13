import React from 'react';
import { DownloadOutlined } from '@fabi/ui/icons';
import { Button, Form } from '@fabi/ui';

const App: React.FC = () => (
  <Form>
    <Form.Item>
      <Button size="large" shape="round" block style={{ marginBottom: 12 }}>
        Submit
      </Button>
      <Button size="large" shape="round" icon={<DownloadOutlined />} />
    </Form.Item>
  </Form>
);

export default App;
