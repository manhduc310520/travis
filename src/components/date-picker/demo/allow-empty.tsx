import React from 'react';
import { DatePicker } from '@fabi/ui';

const App: React.FC = () => (
  <DatePicker.RangePicker aria-label="Date range"
    placeholder={['Start Date', 'Till Now']}
    allowEmpty={[false, true]}
    onChange={(date, dateString) => {
      console.log(date, dateString);
    }}
  />
);

export default App;
