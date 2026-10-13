import React from 'react';
import { Flex, Input } from '@fabi/ui';

const { TextArea } = Input;

const App: React.FC = () => (
  <Flex vertical gap={20}>
    <Flex gap={12}>
      <Input aria-label="Filled" placeholder="Filled" variant="filled" />
      <Input aria-label="Filled" placeholder="Filled" variant="filled" disabled />
      <Input aria-label="Filled" placeholder="Filled" variant="filled" status="error" value="Filled Error" />
    </Flex>
    <Flex gap={12}>
      <Input aria-label="Filled" prefix="$" placeholder="Filled" variant="filled" />
      <Input aria-label="Filled" prefix="$" placeholder="Filled" variant="filled" disabled />
      <Input aria-label="Filled" prefix="$" placeholder="Filled" variant="filled" status="error" value="Filled Error" />
    </Flex>
    <Flex gap={12}>
      <Input aria-label="Filled" addonBefore="http://" addonAfter=".com" placeholder="Filled" variant="filled" />
      <Input aria-label="Filled"
        addonBefore="http://"
        addonAfter=".com"
        placeholder="Filled"
        variant="filled"
        disabled
      />
      <Input aria-label="Filled"
        addonBefore="http://"
        addonAfter=".com"
        placeholder="Filled"
        variant="filled"
        status="error"
        value="Filled Error"
      />
    </Flex>
    <Flex gap={12}>
      <Input aria-label="Filled" addonAfter=".com" placeholder="Filled" variant="filled" />
      <Input aria-label="Filled" addonAfter=".com" placeholder="Filled" variant="filled" disabled />
      <Input aria-label="Filled"
        addonAfter=".com"
        placeholder="Filled"
        variant="filled"
        status="error"
        value="Filled Error"
      />
    </Flex>
    <Flex gap={12}>
      <Input aria-label="Filled" addonBefore="http://" placeholder="Filled" variant="filled" />
      <Input aria-label="Filled" addonBefore="http://" placeholder="Filled" variant="filled" disabled />
      <Input aria-label="Filled"
        addonBefore="http://"
        placeholder="Filled"
        variant="filled"
        status="error"
        value="Filled Error"
      />
    </Flex>
    <TextArea aria-label="Basic" variant="filled" placeholder="Basic" />
    <TextArea aria-label="Basic" variant="filled" placeholder="Basic" status="error" value="Filled Error" />
    <TextArea aria-label="Allow Clear" variant="filled" placeholder="Allow Clear" allowClear />
    <TextArea aria-label="Show Count" variant="filled" placeholder="Show Count" showCount />
    <TextArea aria-label="Show Count"
      variant="filled"
      placeholder="Show Count"
      showCount
      status="error"
      value="Filled Error"
    />
  </Flex>
);

export default App;
