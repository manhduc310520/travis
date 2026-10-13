import React from 'react';
import type { DatePickerProps } from '@fabi/ui';
import { DatePicker } from '@fabi/ui';
import type { Dayjs } from 'dayjs';

const onChange: DatePickerProps<Dayjs, false>['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

const App: React.FC = () => <DatePicker aria-label="Date" onChange={onChange} needConfirm />;

export default App;
