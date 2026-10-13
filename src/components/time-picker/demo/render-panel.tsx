import React from 'react';
import { TimePicker } from '@fabi/ui';

const { _InternalPanelDoNotUseOrYouWillBeFired: InternalTimePicker } = TimePicker;

const App: React.FC = () => <InternalTimePicker />;

export default App;
