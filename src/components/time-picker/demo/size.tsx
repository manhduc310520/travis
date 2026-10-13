import React from 'react';
import { Space, TimePicker } from '@fabi/ui';
import dayjs from 'dayjs';

const App: React.FC = () => (
  <Space wrap>
    <TimePicker aria-label="Time" defaultValue={dayjs('12:08:23', 'HH:mm:ss')} size="large" />
    <TimePicker aria-label="Time" defaultValue={dayjs('12:08:23', 'HH:mm:ss')} />
    <TimePicker aria-label="Time" defaultValue={dayjs('12:08:23', 'HH:mm:ss')} size="small" />
  </Space>
);

export default App;
