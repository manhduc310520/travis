import React from 'react';
import { UploadOutlined } from '@fabi/ui/icons';
import { Button, Upload } from '@fabi/ui';

const App: React.FC = () => (
  <Upload action="/mock-api/upload" directory>
    <Button icon={<UploadOutlined />}>Upload Directory</Button>
  </Upload>
);

export default App;
