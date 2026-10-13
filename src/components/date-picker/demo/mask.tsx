import React from 'react';
import type { DatePickerProps } from '@fabi/ui';
import { DatePicker, Space } from '@fabi/ui';

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

const App: React.FC = () => (
  <Space vertical>
    <DatePicker aria-label="Date"
      format={{
        format: 'YYYY-MM-DD',
        type: 'mask',
      }}
      onChange={onChange}
    />
    <DatePicker aria-label="Date"
      format={{
        format: 'YYYY-MM-DD HH:mm:ss',
        type: 'mask',
      }}
      onChange={onChange}
    />
  </Space>
);

export default App;
