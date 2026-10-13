import React from 'react';
import type { InputNumberProps } from '@fabi/ui';
import { Flex, InputNumber } from '@fabi/ui';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const sharedProps = {
  mode: 'spinner' as const,
  min: 1,
  max: 10,
  defaultValue: 3,
  onChange,
  style: { width: 150 },
};

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <InputNumber aria-label="Outlined" {...sharedProps} placeholder="Outlined" />
    <InputNumber aria-label="Filled" {...sharedProps} variant="filled" placeholder="Filled" />
  </Flex>
);

export default App;
