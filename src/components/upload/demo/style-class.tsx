import React from 'react';
import { UploadOutlined } from '@fabi/ui/icons';
import { Button, Flex, Upload } from '@fabi/ui';
import type { GetProp, UploadProps } from '@fabi/ui';
import { createStyles } from '@fabi/ui/style';

const useStyles = createStyles(({ token }) => ({
  root: {
    borderRadius: token.borderRadius,
    padding: token.padding,
  },
}));

const stylesObject: UploadProps<any>['styles'] = {
  item: {
    borderRadius: 2,
    backgroundColor: 'rgba(5, 5, 5, 0.06)',
    height: 30,
  },
  trigger: {
    backgroundColor: 'rgba(84, 89, 172, 0.1)',
    padding: 8,
    borderRadius: 4,
  },
};

const stylesFn: UploadProps<any>['styles'] = (
  info,
): GetProp<UploadProps<any>, 'styles', 'Return'> => {
  if (info.props.multiple) {
    return {
      root: { border: '1px solid #5459AC' },
      item: {
        borderRadius: 2,
        backgroundColor: 'rgba(5, 5, 5, 0.06)',
        height: 30,
      },
      trigger: {
        backgroundColor: 'rgba(84, 89, 172, 0.2)',
        padding: 8,
        borderRadius: 4,
      },
    };
  }
  return {};
};

const App: React.FC = () => {
  const { styles: classNames } = useStyles();

  const uploadProps: UploadProps<any> = {
    classNames,
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

  return (
    <Flex gap="large" vertical>
      <Upload {...uploadProps} styles={stylesObject}>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
      <Upload {...uploadProps} styles={stylesFn} multiple>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </Flex>
  );
};

export default App;
