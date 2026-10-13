import React from 'react';
import { Slider } from '@fabi/ui';

const App: React.FC = () => <Slider ariaLabelForHandle="Slider" defaultValue={30} tooltip={{ open: true }} />;

export default App;
