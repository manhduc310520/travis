import React from 'react';
import { TimePicker } from '@fabi/ui';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const App: React.FC = () => <TimePicker aria-label="Time" defaultValue={dayjs('12:08:23', 'HH:mm:ss')} disabled />;

export default App;
