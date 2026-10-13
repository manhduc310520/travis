import React from 'react';
import { UploadOutlined } from '@fabi/ui/icons';
import { Button, Space, Upload } from '@fabi/ui';

const App: React.FC = () => (
  <Space vertical style={{ width: '100%' }} size="large">
    <Upload
      action="/mock-api/upload"
      listType="picture"
      maxCount={1}
    >
      <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
    </Upload>
    <Upload
      action="/mock-api/upload"
      listType="picture"
      maxCount={3}
      multiple
    >
      <Button icon={<UploadOutlined />}>Upload (Max: 3)</Button>
    </Upload>
  </Space>
);

export default App;
