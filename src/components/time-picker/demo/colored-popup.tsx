import React from 'react';
import type { TimePickerProps } from '@fabi/ui';
import { TimePicker } from '@fabi/ui';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => (
  <TimePicker aria-label="Time"
    onChange={onChange}
    defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
    classNames={{ popup: { root: 'myCustomClassName' } }}
  />
);

export default App;
