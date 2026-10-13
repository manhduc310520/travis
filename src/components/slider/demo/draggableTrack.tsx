import React from 'react';
import { Slider } from '@fabi/ui';

const App: React.FC = () => <Slider ariaLabelForHandle="Slider" range={{ draggableTrack: true }} defaultValue={[20, 50]} />;

export default App;
