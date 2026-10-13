import React from 'react';
import { Input } from '@fabi/ui';

const { TextArea } = Input;

const App: React.FC = () => (
  <>
    <TextArea aria-label="Text" rows={4} />
    <br />
    <br />
    <TextArea aria-label="maxLength is 6" rows={4} placeholder="maxLength is 6" maxLength={6} />
  </>
);

export default App;
