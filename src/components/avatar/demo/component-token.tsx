import React from 'react';
import { AppstoreOutlined, UserOutlined } from '@fabi/ui/icons';
import { Avatar, Badge, ConfigProvider, Space, Tooltip } from '@fabi/ui';

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      components: {
        Avatar: {
          containerSize: 60,
          containerSizeLG: 30,
          containerSizeSM: 16,

          textFontSize: 14,
          textFontSizeLG: 14,
          textFontSizeSM: 14,

          iconFontSize: 18,
          iconFontSizeLG: 28,
          iconFontSizeSM: 12,

          borderRadius: 10,
          groupOverlapping: -10,
          groupBorderColor: '#eee',
        },
      },
    }}
  >
    <Space>
      <Avatar alt="Avatar" shape="circle" src="/mock-assets/not-exist.jpg">
        A
      </Avatar>
    </Space>
    <Space>
      <Avatar.Group
        max={{
          count: 2,
          style: { color: '#873800', backgroundColor: '#fde3cf' },
        }}
      >
        <Avatar alt="Avatar" src="/mock-assets/avatar-3.svg" />
        <Avatar style={{ backgroundColor: '#873800' }}>K</Avatar>
        <Tooltip title="Ant User" placement="top">
          <Avatar style={{ backgroundColor: '#237804' }} icon={<UserOutlined />} />
        </Tooltip>
        <Avatar style={{ backgroundColor: '#0958d9' }} icon={<AppstoreOutlined />} />
      </Avatar.Group>
    </Space>
    <Space>
      <Badge count={1}>
        <Avatar shape="square" icon={<UserOutlined />} />
      </Badge>
      <Badge dot>
        <Avatar shape="square" icon={<UserOutlined />} />
      </Badge>
    </Space>
  </ConfigProvider>
);

export default App;
