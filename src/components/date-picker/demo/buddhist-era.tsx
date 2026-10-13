import React from 'react';
import { ConfigProvider, DatePicker, Space, Typography } from '@fabi/ui';
import type { DatePickerProps } from '@fabi/ui';
import en from '@fabi/ui/es/date-picker/locale/en_US';
import enUS from '@fabi/ui/es/locale/en_US';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(buddhistEra);

const { Title } = Typography;

// Component level locale
const buddhistLocale: typeof en = {
  ...en,
  lang: {
    ...en.lang,
    fieldDateFormat: 'BBBB-MM-DD',
    fieldDateTimeFormat: 'BBBB-MM-DD HH:mm:ss',
    yearFormat: 'BBBB',
    cellYearFormat: 'BBBB',
  },
};

// ConfigProvider level locale
const globalBuddhistLocale: typeof enUS = {
  ...enUS,
  DatePicker: {
    ...enUS.DatePicker!,
    lang: buddhistLocale.lang,
  },
};

const defaultValue = dayjs('2024-01-01');

const App: React.FC = () => {
  const onChange: DatePickerProps['onChange'] = (_, dateStr) => {
    console.log('onChange:', dateStr);
  };

  return (
    <Space vertical>
      <Title level={4}>By locale props</Title>
      <DatePicker aria-label="Date" defaultValue={defaultValue} locale={buddhistLocale} onChange={onChange} />
      <DatePicker aria-label="Date"
        defaultValue={defaultValue}
        showTime
        locale={buddhistLocale}
        onChange={onChange}
      />

      <Title level={4}>By ConfigProvider</Title>
      <ConfigProvider locale={globalBuddhistLocale}>
        <Space vertical>
          <DatePicker aria-label="Date" defaultValue={defaultValue} onChange={onChange} />
          <DatePicker aria-label="Date" defaultValue={defaultValue} showTime onChange={onChange} />
        </Space>
      </ConfigProvider>
    </Space>
  );
};

export default App;
