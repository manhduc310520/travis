import React from 'react';
import type { TimePickerProps } from '@fabi/ui';
import { Space, TimePicker } from '@fabi/ui';

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => (
  <Space wrap>
    <TimePicker aria-label="Time" use12Hours onChange={onChange} />
    <TimePicker aria-label="Time" use12Hours format="h:mm:ss A" onChange={onChange} />
    <TimePicker aria-label="Time" use12Hours format="h:mm a" onChange={onChange} />
  </Space>
);

export default App;
