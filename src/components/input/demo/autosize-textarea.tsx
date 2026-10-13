import React, { useState } from 'react';
import { Input } from '@fabi/ui';

const { TextArea } = Input;

const App: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <>
      <TextArea aria-label="Autosize height based on content lines" placeholder="Autosize height based on content lines" autoSize />
      <div style={{ margin: '24px 0' }} />
      <TextArea aria-label="Autosize height with minimum and maximum number of lines"
        placeholder="Autosize height with minimum and maximum number of lines"
        autoSize={{ minRows: 2, maxRows: 6 }}
      />
      <div style={{ margin: '24px 0' }} />
      <TextArea aria-label="Controlled autosize"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Controlled autosize"
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
    </>
  );
};

export default App;
