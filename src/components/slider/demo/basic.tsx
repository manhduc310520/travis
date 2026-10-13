import React, { useState } from 'react';
import { Slider, Switch } from '@fabi/ui';

const App: React.FC = () => {
  const [disabled, setDisabled] = useState(false);

  const onChange = (checked: boolean) => {
    setDisabled(checked);
  };

  return (
    <>
      <Slider ariaLabelForHandle="Slider" defaultValue={30} disabled={disabled} />
      <Slider ariaLabelForHandle="Slider" range defaultValue={[20, 50]} disabled={disabled} />
      Disabled: <Switch aria-label="Switch" size="small" checked={disabled} onChange={onChange} />
    </>
  );
};

export default App;
