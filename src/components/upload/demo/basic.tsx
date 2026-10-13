import React from 'react';
import { UploadOutlined } from '@fabi/ui/icons';
import type { UploadProps } from '@fabi/ui';
import { Button, message, Upload } from '@fabi/ui';

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const props: UploadProps = {
    name: 'file',
    action: '/mock-api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        messageApi.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        messageApi.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <>
      {contextHolder}
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </>
  );
};

export default App;
