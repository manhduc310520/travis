import React, { useState } from 'react';
import type { ConfigProviderProps, RadioChangeEvent } from '@fabi/ui';
import { DatePicker, Radio, Space } from '@fabi/ui';

type SizeType = ConfigProviderProps['componentSize'];

const { RangePicker } = DatePicker;

const App: React.FC = () => {
  const [size, setSize] = useState<SizeType>('medium');

  const handleSizeChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };

  return (
    <Space vertical size={12}>
      <Radio.Group value={size} onChange={handleSizeChange}>
        <Radio.Button value="large">Large</Radio.Button>
        <Radio.Button value="medium">Medium</Radio.Button>
        <Radio.Button value="small">Small</Radio.Button>
      </Radio.Group>
      <DatePicker aria-label="Date" size={size} />
      <DatePicker aria-label="Date" size={size} picker="month" />
      <RangePicker aria-label="Date range" size={size} />
      <DatePicker aria-label="Date" size={size} picker="week" />
    </Space>
  );
};

export default App;
