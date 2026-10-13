import React, { useState } from 'react';
import { CloseSquareFilled } from '@fabi/ui/icons';
import { Mentions } from '@fabi/ui';

const App: React.FC = () => {
  const [value, setValue] = useState('hello world');
  return (
    <>
      <Mentions aria-label="Mention" value={value} onChange={setValue} allowClear />
      <br />
      <br />
      <Mentions aria-label="Mention"
        value={value}
        onChange={setValue}
        allowClear={{ clearIcon: <CloseSquareFilled /> }}
      />
      <br />
      <br />
      <Mentions aria-label="Mention" value={value} onChange={setValue} allowClear rows={3} />
    </>
  );
};

export default App;
