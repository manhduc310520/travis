import React, { useState } from 'react';
import type { DatePickerProps, TimePickerProps } from '@fabi/ui';
import { DatePicker, Select, Space, TimePicker } from '@fabi/ui';
import type { Dayjs } from 'dayjs';

type PickerType = 'time' | 'date';

interface PickerWithTypeProps {
  type: PickerType;
  onChange: TimePickerProps['onChange'] | DatePickerProps<Dayjs, false>['onChange'];
}

const PickerWithType: React.FC<PickerWithTypeProps> = ({ type, onChange }) => {
  if (type === 'time') {
    return <TimePicker aria-label="Time" onChange={onChange} />;
  }
  if (type === 'date') {
    return <DatePicker aria-label="Date" onChange={onChange} />;
  }
  return <DatePicker aria-label="Date" picker={type} onChange={onChange} />;
};

const App: React.FC = () => {
  const [type, setType] = useState<PickerType>('time');

  return (
    <Space>
      <Select
        aria-label="Picker Type"
        value={type}
        onChange={setType}
        options={[
          { label: 'Time', value: 'time' },
          { label: 'Date', value: 'date' },
          { label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
          { label: 'Quarter', value: 'quarter' },
          { label: 'Year', value: 'year' },
        ]}
      />
      <PickerWithType type={type} onChange={(value) => console.log(value)} />
    </Space>
  );
};

export default App;
