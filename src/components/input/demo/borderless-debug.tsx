import React from 'react';
import { Input } from '@fabi/ui';

const { TextArea } = Input;

const App: React.FC = () => (
  <div style={{ backgroundColor: 'rgba(0, 0, 128, .2)' }}>
    <Input aria-label="Unbordered" placeholder="Unbordered" variant="borderless" />
    <Input aria-label="Unbordered" placeholder="Unbordered" variant="borderless" size="large" />
    <TextArea aria-label="Unbordered" placeholder="Unbordered" variant="borderless" />
    <TextArea aria-label="Unbordered" placeholder="Unbordered" variant="borderless" allowClear />
    <Input aria-label="Unbordered" placeholder="Unbordered" variant="borderless" allowClear />
    <Input aria-label="Input" prefix="￥" suffix="RMB" variant="borderless" />
    <Input aria-label="Input" prefix="￥" suffix="RMB" disabled variant="borderless" />
    <TextArea aria-label="Text" allowClear style={{ border: '2px solid #000' }} />

    {/* status */}
    <Input aria-label="Input" defaultValue="error" variant="borderless" status="error" />
    <Input aria-label="Input" defaultValue="warning" variant="borderless" status="warning" />
    <Input aria-label="Input" prefix="$" defaultValue="error" variant="borderless" status="error" />
    <Input aria-label="Input" prefix="$" defaultValue="warning" variant="borderless" status="warning" />
  </div>
);

export default App;
