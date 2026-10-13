import React from 'react';
import { CheckCircleTwoTone, HeartTwoTone, SmileTwoTone } from '@fabi/ui/icons';
import { Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space>
    <SmileTwoTone />
    <HeartTwoTone twoToneColor="#c41d7f" />
    <CheckCircleTwoTone twoToneColor="#237804" />
  </Space>
);

export default App;
