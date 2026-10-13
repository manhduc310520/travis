import React from 'react';
import { DownloadOutlined } from '@fabi/ui/icons';
import { Button, Tooltip } from '@fabi/ui';
import type { GetProps } from '@fabi/ui';

type ButtonGroupProps = GetProps<typeof Button.Group>;

const CustomGroup: React.FC<ButtonGroupProps> = (props) => (
  <Button.Group {...props}>
    <Button type="primary">Button 1</Button>
    <Button type="primary">Button 2</Button>
    <Tooltip title="Tooltip">
      <Button type="primary" icon={<DownloadOutlined />} disabled />
    </Tooltip>
    <Tooltip title="Tooltip">
      <Button type="primary" icon={<DownloadOutlined />} />
    </Tooltip>
  </Button.Group>
);

const App: React.FC = () => (
  <>
    <CustomGroup size="small" />
    <br />
    <CustomGroup />
    <br />
    <CustomGroup size="large" />
  </>
);

export default App;
