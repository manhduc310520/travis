import React from 'react';
import { ZoomInOutlined } from '@fabi/ui/icons';
import { Image, Space } from '@fabi/ui';
import { createStyles } from '@fabi/ui/style';

const useStyles = createStyles((props) => {
  const { css } = props;
  return {
    mask: css`
      opacity: 1;
      font-size: 20px;
    `,
  };
});

const App: React.FC = () => {
  const { styles } = useStyles();
  return (
    <Image
      width={96}
      alt="basic image"
      src="/mock-assets/photo-6.svg"
      classNames={{ popup: { mask: styles.mask } }}
      preview={{
        cover: (
          <Space vertical align="center">
            <ZoomInOutlined />
            Preview
          </Space>
        ),
      }}
    />
  );
};

export default App;
