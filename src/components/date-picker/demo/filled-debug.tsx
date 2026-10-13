import React from 'react';
import { DatePicker, Space } from '@fabi/ui';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

const App: React.FC = () => (
  <Space vertical size={12}>
    <DatePicker aria-label="Date" variant="filled" defaultValue={dayjs('2015-06-06', dateFormat)} disabled />
    <DatePicker aria-label="Date"
      variant="filled"
      picker="month"
      defaultValue={dayjs('2015-06', 'YYYY-MM')}
      disabled
    />
    <RangePicker aria-label="Date range"
      variant="filled"
      defaultValue={[dayjs('2015-06-06', dateFormat), dayjs('2015-06-06', dateFormat)]}
      disabled
    />
    <RangePicker aria-label="Date range"
      variant="filled"
      defaultValue={[dayjs('2019-09-03', dateFormat), dayjs('2019-11-22', dateFormat)]}
      disabled={[false, true]}
    />
    <DatePicker aria-label="Date"
      defaultValue={dayjs('2023-12-25')}
      variant="filled"
      status="error"
      style={{ width: '100%' }}
      previewValue={false}
    />
    <DatePicker aria-label="Date" variant="filled" status="warning" style={{ width: '100%' }} />
    <RangePicker aria-label="Date range" variant="filled" status="error" style={{ width: '100%' }} />
    <RangePicker aria-label="Date range" variant="filled" status="warning" style={{ width: '100%' }} />
  </Space>
);

export default App;
