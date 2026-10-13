import React from 'react';
import { Button, Checkbox, Input, InputNumber, Select, Space, Tooltip } from '@fabi/ui';

const WrapperTooltip: React.FC<React.PropsWithChildren> = (props) => (
  <Tooltip title="Thanks for using antd. Have a nice day !" {...props} />
);

const App: React.FC = () => (
  <Space>
    <WrapperTooltip>
      <Button disabled>Disabled</Button>
    </WrapperTooltip>
    <WrapperTooltip>
      <Input aria-label="disabled" disabled placeholder="disabled" />
    </WrapperTooltip>
    <WrapperTooltip>
      <InputNumber aria-label="Number" disabled />
    </WrapperTooltip>
    <WrapperTooltip>
      <Checkbox aria-label="Checkbox" disabled />
    </WrapperTooltip>
    <WrapperTooltip>
      <Select aria-label="Select" disabled />
    </WrapperTooltip>
  </Space>
);

export default App;
