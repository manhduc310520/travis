import React, { useRef, useState } from 'react';
import type { InputRef } from '@fabi/ui';
import { Button, Input, Space, Switch } from '@fabi/ui';

const App: React.FC = () => {
  const inputRef = useRef<InputRef>(null);
  const [input, setInput] = useState(true);

  const sharedProps = {
    style: { width: '100%' },
    defaultValue: 'FABi CMS love you!',
    ref: inputRef,
  };

  return (
    <Space vertical style={{ width: '100%' }}>
      <Space wrap>
        <Button
          onClick={() => {
            inputRef.current?.focus({ cursor: 'start' });
          }}
        >
          Focus at first
        </Button>
        <Button
          onClick={() => {
            inputRef.current?.focus({ cursor: 'end' });
          }}
        >
          Focus at last
        </Button>
        <Button
          onClick={() => {
            inputRef.current?.focus({ cursor: 'all' });
          }}
        >
          Focus to select all
        </Button>
        <Button
          onClick={() => {
            inputRef.current?.focus({ preventScroll: true });
          }}
        >
          Focus prevent scroll
        </Button>
        <Switch aria-label="Switch"
          checked={input}
          checkedChildren="Input"
          unCheckedChildren="TextArea"
          onChange={() => {
            setInput((prev) => !prev);
          }}
        />
      </Space>
      <br />
      {input ? <Input aria-label="Input" {...sharedProps} /> : <Input.TextArea aria-label="Text" {...sharedProps} />}
    </Space>
  );
};

export default App;
