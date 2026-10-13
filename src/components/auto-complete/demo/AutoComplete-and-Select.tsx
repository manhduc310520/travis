import React from 'react';
import { AutoComplete, Flex, Select } from '@fabi/ui';

const AutoCompleteAndSelect = () => {
  return (
    <Flex vertical gap={16}>
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Flex key={size}>
          <Select aria-label="Select"
            value="centered"
            size={size}
            style={{ width: 200 }}
            showSearch={{ searchValue: 'centered' }}
          />
          <AutoComplete aria-label="Search" value="centered" size={size} style={{ width: 200 }} />
        </Flex>
      ))}
    </Flex>
  );
};

export default AutoCompleteAndSelect;
