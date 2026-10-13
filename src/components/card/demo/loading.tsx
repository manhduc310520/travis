import React, { useState } from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@fabi/ui/icons';
import { Avatar, Card, Flex, Switch } from '@fabi/ui';

const actions: React.ReactNode[] = [
  <EditOutlined key="edit" />,
  <SettingOutlined key="setting" />,
  <EllipsisOutlined key="ellipsis" />,
];

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  return (
    <Flex gap="medium" align="start" vertical>
      <Switch
        aria-label="Show card content"
        checked={!loading}
        onChange={(checked) => setLoading(!checked)}
      />
      <Card loading={loading} actions={actions} style={{ minWidth: 300 }}>
        <Card.Meta
          avatar={<Avatar alt="Avatar" src="/mock-assets/avatar-2.svg" />}
          title="Card title"
          description={
            <>
              <p>This is the description</p>
              <p>This is the description</p>
            </>
          }
        />
      </Card>
      <Card loading={loading} actions={actions} style={{ minWidth: 300 }}>
        <Card.Meta
          avatar={<Avatar alt="Avatar" src="/mock-assets/avatar-3.svg" />}
          title="Card title"
          description={
            <>
              <p>This is the description</p>
              <p>This is the description</p>
            </>
          }
        />
      </Card>
    </Flex>
  );
};

export default App;
