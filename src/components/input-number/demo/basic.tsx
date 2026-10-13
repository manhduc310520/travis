import React from 'react';
import type { InputNumberProps } from '@fabi/ui';
import { InputNumber } from '@fabi/ui';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const App: React.FC = () => <InputNumber aria-label="Number" min={1} max={10} defaultValue={3} onChange={onChange} />;

export default App;
