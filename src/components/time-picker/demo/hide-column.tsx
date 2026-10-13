import React from 'react';
import { TimePicker } from '@fabi/ui';
import dayjs from 'dayjs';

const format = 'HH:mm';

const App: React.FC = () => <TimePicker aria-label="Time" defaultValue={dayjs('12:08', format)} format={format} />;

export default App;
