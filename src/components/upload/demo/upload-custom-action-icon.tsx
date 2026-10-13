import React from 'react';
import { StarOutlined, UploadOutlined } from '@fabi/ui/icons';
import type { UploadProps } from '@fabi/ui';
import { Button, Upload } from '@fabi/ui';

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
      size: 1234567,
      status: 'done',
      response: 'Server Error 500', // custom error message to show
      url: '/mock-assets/photo-12.svg',
    },
    {
      uid: '2',
      name: 'yyy.png',
      size: 1234567,
      status: 'done',
      url: '/mock-assets/photo-3.svg',
    },
    {
      uid: '3',
      name: 'zzz.png',
      size: 1234567,
      status: 'error',
      response: 'Server Error 500', // custom error message to show
      url: '/mock-assets/photo-6.svg',
    },
  ],
  showUploadList: {
    extra: ({ size = 0 }) => (
      <span style={{ color: 'light-dark(#666666, rgba(255, 255, 255, 0.65))' }}>({(size / 1024 / 1024).toFixed(2)}MB)</span>
    ),
    showDownloadIcon: true,
    downloadIcon: 'Download',
    showRemoveIcon: true,
    removeIcon: <StarOutlined onClick={(e) => console.log(e, 'custom removeIcon event')} />,
  },
};

const App: React.FC = () => (
  <Upload {...props}>
    <Button icon={<UploadOutlined />}>Upload</Button>
  </Upload>
);

export default App;
