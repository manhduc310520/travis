import React from 'react';
import type { TimePickerProps } from '@fabi/ui';
import { TimePicker } from '@fabi/ui';

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => <TimePicker aria-label="Time" onChange={onChange} needConfirm />;

export default App;
