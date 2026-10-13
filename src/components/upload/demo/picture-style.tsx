import React from 'react';
import { UploadOutlined } from '@fabi/ui/icons';
import { Button, Upload } from '@fabi/ui';
import type { UploadFile } from '@fabi/ui';

const fileList: UploadFile[] = [
  {
    uid: '0',
    name: 'xxx.png',
    status: 'uploading',
    percent: 33,
  },
  {
    uid: '-1',
    name: 'yyy.png',
    status: 'done',
    url: '/mock-assets/photo-6.svg',
    thumbUrl: '/mock-assets/photo-6.svg',
  },
  {
    uid: '-2',
    name: 'zzz.png',
    status: 'error',
  },
];

const App: React.FC = () => (
  <Upload
    action="/mock-api/upload"
    listType="picture"
    defaultFileList={fileList}
  >
    <Button type="primary" icon={<UploadOutlined />}>
      Upload
    </Button>
  </Upload>
);

export default App;
