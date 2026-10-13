import React from 'react';
import { InboxOutlined, PlusOutlined, UploadOutlined } from '@fabi/ui/icons';
import { Button, Space, Upload } from '@fabi/ui';
import type { UploadFile } from '@fabi/ui';

const { Dragger } = Upload;

const fileList: UploadFile[] = [
  {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: '/mock-assets/photo-6.svg',
  },
  {
    uid: '-2',
    name: 'image.png',
    status: 'done',
    url: '/mock-assets/photo-6.svg',
  },
  {
    uid: '-xxx',
    percent: 50,
    name: 'image.png',
    status: 'uploading',
    url: '/mock-assets/photo-6.svg',
  },
  {
    uid: '-5',
    name: 'image.png',
    status: 'error',
  },
];

const App: React.FC = () => {
  const uploadButton = (
    <button
      style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
      type="button"
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Space vertical>
      <Upload disabled>Click Text to Upload</Upload>
      <Upload disabled>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <Upload name="avatar" listType="picture-card" fileList={fileList} disabled>
        {uploadButton}
      </Upload>
      <Upload name="avatar" listType="picture-circle" fileList={fileList} disabled>
        {uploadButton}
      </Upload>
      <Dragger disabled>
        <p className="fabi-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="fabi-upload-text">Click or drag file to this area to upload</p>
        <p className="fabi-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or
          other banned files.
        </p>
      </Dragger>
    </Space>
  );
};

export default App;
