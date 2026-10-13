import React, { useState } from 'react';
import { Slider, Switch } from '@fabi/ui';

const App: React.FC = () => {
  const [reverse, setReverse] = useState(true);

  return (
    <>
      <Slider ariaLabelForHandle="Slider" defaultValue={30} reverse={reverse} />
      <Slider ariaLabelForHandle="Slider" range defaultValue={[20, 50]} reverse={reverse} />
      Reversed: <Switch aria-label="Switch" size="small" checked={reverse} onChange={setReverse} />
    </>
  );
};

export default App;
