import React from 'react';
import { SmileOutlined } from '@fabi/ui/icons';
import { Button, notification } from '@fabi/ui';

const App: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      title: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      icon: <SmileOutlined style={{ color: '#0958d9' }} />,
    });
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={openNotification}>
        Open the notification box
      </Button>
    </>
  );
};

export default App;
