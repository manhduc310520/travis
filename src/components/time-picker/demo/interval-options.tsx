import React from 'react';
import { TimePicker } from '@fabi/ui';

const App: React.FC = () => <TimePicker aria-label="Time" minuteStep={15} secondStep={10} hourStep={1} />;

export default App;
