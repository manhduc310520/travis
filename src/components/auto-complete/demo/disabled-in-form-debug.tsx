import React from 'react';
import { AutoComplete, Flex, Form } from '@fabi/ui';

const options = [{ value: 'Disabled Value' }];

const App: React.FC = () => (
  <Flex vertical gap={12} style={{ width: 240 }}>
    <Form disabled>
      <Form.Item label="Form disabled" style={{ marginBottom: 0 }}>
        <AutoComplete aria-label="Search" value="Disabled Value" options={options} />
      </Form.Item>
    </Form>
    <AutoComplete aria-label="Search" disabled value="Disabled Value" options={options} />
  </Flex>
);

export default App;
