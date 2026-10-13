import React from 'react';
import { InboxOutlined } from '@fabi/ui/icons';
import type { UploadProps } from '@fabi/ui';
import { message, Upload } from '@fabi/ui';

const { Dragger } = Upload;

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: '/mock-api/upload',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        messageApi.success(`${info.file.name} file uploaded successfully.`);
      }
      if (status === 'error') {
        messageApi.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <>
      {contextHolder}
      <Dragger {...props}>
        <p className="fabi-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="fabi-upload-text">Click or drag file to this area to upload</p>
        <p className="fabi-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or
          other banned files.
        </p>
      </Dragger>
    </>
  );
};

export default App;
