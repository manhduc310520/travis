import React from 'react';
import { AppstoreOutlined, UserOutlined } from '@fabi/ui/icons';
import { Avatar, Divider, Tooltip } from '@fabi/ui';

const App: React.FC = () => (
  <>
    <Avatar.Group>
      <Avatar alt="Avatar" src="/mock-assets/avatar-2.svg" />
      <a href="https://example.com">
        <Avatar style={{ backgroundColor: '#873800' }}>K</Avatar>
      </a>
      <Tooltip title="Ant User" placement="top">
        <Avatar style={{ backgroundColor: '#237804' }} icon={<UserOutlined />} />
      </Tooltip>
      <Avatar style={{ backgroundColor: '#0958d9' }} icon={<AppstoreOutlined />} />
    </Avatar.Group>
    <Divider />
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
    <Divider />
    <Avatar.Group
      size="large"
      max={{
        count: 2,
        style: { color: '#873800', backgroundColor: '#fde3cf' },
      }}
    >
      <Avatar alt="Avatar" src="/mock-assets/avatar-4.svg" />
      <Avatar style={{ backgroundColor: '#873800' }}>K</Avatar>
      <Tooltip title="Ant User" placement="top">
        <Avatar style={{ backgroundColor: '#237804' }} icon={<UserOutlined />} />
      </Tooltip>
      <Avatar style={{ backgroundColor: '#0958d9' }} icon={<AppstoreOutlined />} />
    </Avatar.Group>
    <Divider />
    <Avatar.Group
      size="large"
      max={{
        count: 2,
        style: { color: '#873800', backgroundColor: '#fde3cf', cursor: 'pointer' },
        popover: { trigger: 'click' },
      }}
    >
      <Avatar alt="Avatar" src="/mock-assets/photo-2.svg" />
      <Avatar style={{ backgroundColor: '#873800' }}>K</Avatar>
      <Tooltip title="Ant User" placement="top">
        <Avatar style={{ backgroundColor: '#237804' }} icon={<UserOutlined />} />
      </Tooltip>
      <Avatar style={{ backgroundColor: '#0958d9' }} icon={<AppstoreOutlined />} />
    </Avatar.Group>
    <Divider />
    <Avatar.Group shape="square">
      <Avatar style={{ backgroundColor: '#fde3cf' }}>A</Avatar>
      <Avatar style={{ backgroundColor: '#873800' }}>K</Avatar>
      <Avatar style={{ backgroundColor: '#237804' }} icon={<UserOutlined />} />
      <Avatar style={{ backgroundColor: '#0958d9' }} icon={<AppstoreOutlined />} />
    </Avatar.Group>
  </>
);

export default App;
