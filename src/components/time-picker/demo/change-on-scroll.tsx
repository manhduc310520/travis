import React from 'react';
import type { TimePickerProps } from '@fabi/ui';
import { TimePicker } from '@fabi/ui';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => <TimePicker aria-label="Time" onChange={onChange} changeOnScroll needConfirm={false} />;

export default App;
