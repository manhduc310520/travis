import React from 'react';
import { UserOutlined } from '@fabi/ui/icons';
import { Avatar, Space } from '@fabi/ui';

const url = '/mock-assets/illustration.svg';

const App: React.FC = () => (
  <Space size={16} wrap>
    <Avatar icon={<UserOutlined />} />
    <Avatar>U</Avatar>
    <Avatar size={40}>USER</Avatar>
    <Avatar alt="Avatar" src={url} />
    <Avatar src={<img draggable={false} src={url} alt="avatar" />} />
    <Avatar style={{ backgroundColor: '#fde3cf', color: '#873800' }}>U</Avatar>
    <Avatar style={{ backgroundColor: '#237804' }} icon={<UserOutlined />} />
  </Space>
);

export default App;
