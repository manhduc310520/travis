import React from 'react';
import type { InputNumberProps } from '@fabi/ui';
import { InputNumber, Space } from '@fabi/ui';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const App: React.FC = () => (
  <Space wrap>
    <InputNumber aria-label="Number" size="large" min={1} max={100000} defaultValue={3} onChange={onChange} />
    <InputNumber aria-label="Number" min={1} max={100000} defaultValue={3} onChange={onChange} />
    <InputNumber aria-label="Number" size="small" min={1} max={100000} defaultValue={3} onChange={onChange} />
  </Space>
);

export default App;
