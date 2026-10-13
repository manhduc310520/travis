import React from 'react';
import { Flex, Progress, Slider, Typography } from '@fabi/ui';

const App: React.FC = () => {
  const [stepsCount, setStepsCount] = React.useState<number>(5);
  const [stepsGap, setStepsGap] = React.useState<number>(7);
  return (
    <>
      <Typography.Title level={5}>Custom count:</Typography.Title>
      <Slider ariaLabelForHandle="Slider" min={2} max={10} value={stepsCount} onChange={setStepsCount} />
      <Typography.Title level={5}>Custom gap:</Typography.Title>
      <Slider ariaLabelForHandle="Slider" step={4} min={0} max={40} value={stepsGap} onChange={setStepsGap} />
      <Flex wrap gap="medium" style={{ marginTop: 16 }}>
        <Progress aria-label="Progress"
          type="dashboard"
          steps={8}
          percent={50}
          railColor="rgba(0, 0, 0, 0.06)"
          strokeWidth={20}
        />
        <Progress aria-label="Progress"
          type="circle"
          percent={100}
          steps={{ count: stepsCount, gap: stepsGap }}
          railColor="rgba(0, 0, 0, 0.06)"
          strokeWidth={20}
        />
      </Flex>
    </>
  );
};

export default App;
