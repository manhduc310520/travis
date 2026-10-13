import React from 'react';
import { CheckCircleFilled, CloseCircleFilled, ReloadOutlined } from '@fabi/ui/icons';
import type { QRCodeProps } from '@fabi/ui';
import { Button, Flex, QRCode, Space, Spin } from '@fabi/ui';

const value = 'https://example.com';

const customStatusRender: QRCodeProps['statusRender'] = (info) => {
  switch (info.status) {
    case 'expired':
      return (
        <div>
          <CloseCircleFilled style={{ color: 'red' }} /> {info.locale?.expired}
          <p>
            <Button type="link" onClick={info.onRefresh}>
              <ReloadOutlined /> {info.locale?.refresh}
            </Button>
          </p>
        </div>
      );
    case 'loading':
      return (
        <Space vertical>
          <Spin />
          <p>Loading...</p>
        </Space>
      );
    case 'scanned':
      return (
        <div>
          <CheckCircleFilled style={{ color: 'green' }} /> {info.locale?.scanned}
        </div>
      );
    default:
      return null;
  }
};

const App: React.FC = () => (
  <Flex gap="medium" wrap>
    <QRCode aria-label="QR code" value={value} status="loading" statusRender={customStatusRender} />
    <QRCode aria-label="QR code"
      value={value}
      status="expired"
      onRefresh={() => console.log('refresh')}
      statusRender={customStatusRender}
    />
    <QRCode aria-label="QR code" value={value} status="scanned" statusRender={customStatusRender} />
  </Flex>
);

export default App;
