import React from 'react';
import { UploadOutlined } from '@fabi/ui/icons';
import type { UploadProps } from '@fabi/ui';
import { Button, ConfigProvider, Upload } from '@fabi/ui';

const props: UploadProps = {
  action: '/mock-api/upload',
  onChange({ file, fileList }) {
    if (file.status !== 'uploading') {
      console.log(file, fileList);
    }
  },
  defaultFileList: [
    {
      uid: '1',
      name: 'xxx.png',
      status: 'uploading',
      url: '/mock-assets/photo-12.svg',
      percent: 33,
    },
    {
      uid: '2',
      name: 'yyy.png',
      status: 'done',
      url: '/mock-assets/photo-3.svg',
    },
    {
      uid: '3',
      name: 'zzz.png',
      status: 'error',
      response: 'Server Error 500', // custom error message to show
      url: '/mock-assets/photo-6.svg',
    },
  ],
};

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      components: {
        Upload: {
          actionsColor: 'yellow',
        },
      },
    }}
  >
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  </ConfigProvider>
);

export default App;
