import React from 'react';
import { SmileOutlined } from '@fabi/ui/icons';
import { Space, TimePicker } from '@fabi/ui';
import type { TimePickerProps } from '@fabi/ui';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => (
  <Space vertical size={12}>
    <TimePicker aria-label="Time"
      suffixIcon={<SmileOutlined />}
      onChange={onChange}
      defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
    />
    <TimePicker aria-label="Time" prefix={<SmileOutlined />} />
    <TimePicker.RangePicker aria-label="Time range" prefix={<SmileOutlined />} />
  </Space>
);

export default App;
