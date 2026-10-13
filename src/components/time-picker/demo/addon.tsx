import React, { useState } from 'react';
import { Button, TimePicker } from '@fabi/ui';

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <TimePicker aria-label="Time"
      open={open}
      onOpenChange={setOpen}
      renderExtraFooter={() => (
        <Button size="small" type="primary" onClick={() => setOpen(false)}>
          OK
        </Button>
      )}
    />
  );
};

export default App;
