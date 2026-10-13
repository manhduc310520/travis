import React from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@fabi/ui/icons';
import { Avatar, Card } from '@fabi/ui';

const { Meta } = Card;

const App: React.FC = () => (
  <Card
    style={{ width: 300 }}
    cover={
      <img
        draggable={false}
        alt="example"
        src="/mock-assets/photo-12.svg"
      />
    }
    actions={[
      <SettingOutlined key="setting" />,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      avatar={<Avatar alt="Avatar" src="/mock-assets/avatar-9.svg" />}
      title="Card title"
      description="This is the description"
    />
  </Card>
);

export default App;
