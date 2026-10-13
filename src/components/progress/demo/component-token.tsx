import React from 'react';
import { ConfigProvider, Progress, Space } from '@fabi/ui';

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      token: { marginXXS: 20, fontSizeSM: 24 },
      components: {
        Progress: {
          defaultColor: '#bae0ff',
          remainingColor: '#f5222d',
          colorText: '#237804',
          circleTextColor: '#237804',
          lineBorderRadius: 50,
        },
      },
    }}
  >
    <Space vertical>
      <Progress aria-label="Progress" percent={50} />
      <Progress aria-label="Progress" percent={50} size="small" />
      <Progress aria-label="Progress" percent={50} size={[300, 20]} />
    </Space>
    <br />
    <br />
    <Space size={30}>
      <Progress aria-label="Progress" type="circle" percent={50} />
      <Progress aria-label="Progress" type="circle" percent={50} size="small" />
      <Progress aria-label="Progress" type="circle" percent={50} size={20} />
    </Space>
    <br />
    <br />
    <Space size={30}>
      <Progress aria-label="Progress" type="dashboard" percent={50} />
      <Progress aria-label="Progress" type="dashboard" percent={50} size="small" />
      <Progress aria-label="Progress" type="dashboard" percent={50} size={20} />
    </Space>
    <br />
    <br />
    <Space size={30} wrap>
      <Progress aria-label="Progress" steps={3} percent={50} />
      <Progress aria-label="Progress" steps={3} percent={50} size="small" />
      <Progress aria-label="Progress" steps={3} percent={50} size={20} />
      <Progress aria-label="Progress" steps={3} percent={50} size={[20, 30]} />
    </Space>
  </ConfigProvider>
);

export default App;
