import React from 'react';
import { UploadOutlined } from '@fabi/ui/icons';
import type { UploadProps } from '@fabi/ui';
import { Button, Upload } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root container element with layout styles, disabled text color, user-select control, cursor styles and other basic styles',
    list: 'File list container with layout arrangement, transition animations, spacing control and other styles',
    item: 'File item element with padding, background color, border styles, hover effects, status colors, transition animations and other styles',
    trigger:
      'Upload button container with button styles, disabled state, visibility control and other styles',
  },
};

const uploadProps: UploadProps = {
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

const Block: React.FC<Readonly<UploadProps<any>>> = (props) => (
  <Upload {...uploadProps} {...props}>
    <Button icon={<UploadOutlined />}>Upload</Button>
  </Upload>
);

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Upload"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'list', desc: locale.list, version: '6.0.0' },
        { name: 'item', desc: locale.item, version: '6.0.0' },
        { name: 'trigger', desc: locale.trigger, version: '6.3.0' },
      ]}
    >
      <Block />
    </SemanticPreview>
  );
};

export default App;
