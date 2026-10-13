import React from 'react';
import { Input } from '@fabi/ui';

const { TextArea } = Input;

const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  console.log(e);
};

const App: React.FC = () => (
  <>
    <Input aria-label="input with clear icon" placeholder="input with clear icon" allowClear onChange={onChange} />
    <br />
    <br />
    <TextArea aria-label="textarea with clear icon" placeholder="textarea with clear icon" allowClear onChange={onChange} />
  </>
);

export default App;
