import React, { useState } from 'react';
import { Button, Image, InputNumber } from '@fabi/ui';

const App: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scaleStep, setScaleStep] = useState(0.5);

  return (
    <>
      <div>
        scaleStep:{' '}
        <InputNumber aria-label="Number"
          min={0.1}
          max={5}
          defaultValue={0.5}
          step={0.1}
          onChange={(val) => setScaleStep(val!)}
        />
      </div>
      <br />
      <Button type="primary" onClick={() => setOpen(true)}>
        show image preview
      </Button>
      <Image
        width={200}
        style={{ display: 'none' }}
        alt="basic image"
        src="/mock-assets/photo-3.svg"
        preview={{
          open,
          scaleStep,
          src: '/mock-assets/photo-6.svg',
          onOpenChange: (nextOpen) => {
            setOpen(nextOpen);
          },
        }}
      />
    </>
  );
};

export default App;
