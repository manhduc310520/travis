import React from 'react';
import { Flex, Input } from '@fabi/ui';

const { TextArea } = Input;

const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  console.log('Change:', e.target.value);
};

const App: React.FC = () => (
  <Flex vertical gap={32}>
    <Input aria-label="Input" showCount maxLength={20} onChange={onChange} />
    <TextArea aria-label="can resize" showCount maxLength={100} onChange={onChange} placeholder="can resize" />
    <TextArea aria-label="disable resize"
      showCount
      maxLength={100}
      onChange={onChange}
      placeholder="disable resize"
      style={{ height: 120, resize: 'none' }}
    />
  </Flex>
);

export default App;
