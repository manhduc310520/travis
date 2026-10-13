import React from 'react';
import { Flex, Select } from '@fabi/ui';
import type { SelectProps } from '@fabi/ui';

const sharedSelectProps: SelectProps<string> = {
  value: 'lucy',
  variant: 'filled' as const,
  style: { flex: '1 1 50%', minWidth: 0 },
  options: [
    { value: 'jack', label: 'Jack' },
    { value: 'lucy', label: 'Lucy' },
    { value: 'Yiminghe', label: 'yiminghe' },
  ],
};

const App: React.FC = () => (
  <Flex gap={12} vertical>
    <Flex gap={8}>
      <Select aria-label="Select" {...sharedSelectProps} disabled />
      <Select aria-label="Outlined" {...sharedSelectProps} disabled mode="multiple" placeholder="Outlined" />
    </Flex>
    <Flex gap={8}>
      <Select aria-label="Select" {...sharedSelectProps} status="error" />
      <Select aria-label="Outlined" {...sharedSelectProps} status="error" mode="multiple" placeholder="Outlined" />
    </Flex>
    <Flex gap={8}>
      <Select aria-label="Select" {...sharedSelectProps} disabled status="error" />
      <Select aria-label="Outlined"
        {...sharedSelectProps}
        disabled
        status="error"
        mode="multiple"
        placeholder="Outlined"
      />
    </Flex>
  </Flex>
);

export default App;
