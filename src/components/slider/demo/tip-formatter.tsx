import React from 'react';
import type { SliderSingleProps } from '@fabi/ui';
import { Slider } from '@fabi/ui';

const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value) => `${value}%`;

const App: React.FC = () => (
  <>
    <Slider ariaLabelForHandle="Slider" tooltip={{ formatter }} />
    <Slider ariaLabelForHandle="Slider" tooltip={{ formatter: null }} />
  </>
);

export default App;
