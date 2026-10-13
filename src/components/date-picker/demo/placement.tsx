import React, { useState } from 'react';
import type { DatePickerProps, RadioChangeEvent } from '@fabi/ui';
import { DatePicker, Radio } from '@fabi/ui';

const { RangePicker } = DatePicker;

const App: React.FC = () => {
  const [placement, setPlacement] = useState<DatePickerProps['placement']>('topLeft');

  const placementChange = (e: RadioChangeEvent) => {
    setPlacement(e.target.value);
  };

  return (
    <>
      <Radio.Group value={placement} onChange={placementChange}>
        <Radio.Button value="topLeft">topLeft</Radio.Button>
        <Radio.Button value="topRight">topRight</Radio.Button>
        <Radio.Button value="bottomLeft">bottomLeft</Radio.Button>
        <Radio.Button value="bottomRight">bottomRight</Radio.Button>
      </Radio.Group>
      <br />
      <br />
      <DatePicker aria-label="Date" placement={placement} />
      <br />
      <br />
      <RangePicker aria-label="Date range" placement={placement} />
    </>
  );
};

export default App;
