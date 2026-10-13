import React from 'react';
import { Flex, InputNumber } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap={12}>
    <Flex gap={12}>
      <InputNumber aria-label="Filled" placeholder="Filled" variant="filled" />
      <InputNumber aria-label="Filled" placeholder="Filled" variant="filled" disabled />
      <InputNumber aria-label="Filled" placeholder="Filled" variant="filled" status="error" />
    </Flex>
    <Flex gap={12}>
      <InputNumber aria-label="Filled" prefix="$" placeholder="Filled" variant="filled" />
      <InputNumber aria-label="Filled" prefix="$" placeholder="Filled" variant="filled" disabled />
      <InputNumber aria-label="Filled" prefix="$" placeholder="Filled" variant="filled" status="error" />
    </Flex>
    <Flex gap={12}>
      <InputNumber aria-label="Filled" addonBefore="http://" addonAfter=".com" placeholder="Filled" variant="filled" />
      <InputNumber aria-label="Filled"
        addonBefore="http://"
        addonAfter=".com"
        placeholder="Filled"
        variant="filled"
        disabled
      />
      <InputNumber aria-label="Filled"
        addonBefore="http://"
        addonAfter=".com"
        placeholder="Filled"
        variant="filled"
        status="error"
      />
    </Flex>
    <Flex gap={12}>
      <InputNumber aria-label="Filled" addonAfter=".com" placeholder="Filled" variant="filled" />
      <InputNumber aria-label="Filled" addonAfter=".com" placeholder="Filled" variant="filled" disabled />
      <InputNumber aria-label="Filled" addonAfter=".com" placeholder="Filled" variant="filled" status="error" />
    </Flex>
    <Flex gap={12}>
      <InputNumber aria-label="Filled" addonBefore="http://" placeholder="Filled" variant="filled" />
      <InputNumber aria-label="Filled" addonBefore="http://" placeholder="Filled" variant="filled" disabled />
      <InputNumber aria-label="Filled" addonBefore="http://" placeholder="Filled" variant="filled" status="error" />
    </Flex>
    <Flex gap={12}>
      <InputNumber aria-label="Outlined"
        addonBefore="http://"
        placeholder="Outlined"
        variant="outlined"
        status="warning"
      />
      <InputNumber aria-label="Filled"
        addonBefore="http://"
        placeholder="Filled"
        variant="filled"
        status="warning"
        disabled
      />
      <InputNumber aria-label="Filled" addonBefore="http://" placeholder="Filled" variant="filled" status="warning" />
    </Flex>
  </Flex>
);

export default App;
