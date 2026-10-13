import React from 'react';
import { QuestionCircleOutlined } from '@fabi/ui/icons';
import { Button, Popconfirm } from '@fabi/ui';

const App: React.FC = () => (
  <Popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
  >
    <Button danger>Delete</Button>
  </Popconfirm>
);

export default App;
