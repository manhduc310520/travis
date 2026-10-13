import React from 'react';
import { AutoComplete, Flex, Form, Input } from '@fabi/ui';

const options = [{ value: 'Burnaby' }, { value: 'Seattle' }, { value: 'Los Angeles' }];

const App: React.FC = () => (
  <Flex gap={24} wrap>
    <Form layout="vertical" variant="filled" style={{ width: 280 }}>
      <Form.Item label="AutoComplete TextArea">
        <AutoComplete aria-label="Search" options={options}>
          <Input.TextArea aria-label="Custom TextArea" placeholder="Custom TextArea" />
        </AutoComplete>
      </Form.Item>
      <Form.Item label="Input TextArea">
        <Input.TextArea aria-label="Compare TextArea" placeholder="Compare TextArea" />
      </Form.Item>
    </Form>
  </Flex>
);

export default App;
