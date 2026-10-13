import React from 'react';
import { Button, Divider, Space, Tooltip } from '@fabi/ui';

const colors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];

const customColors = ['#ad2102', '#0958d9', '#237804', '#0958d9'];

const App: React.FC = () => (
  <>
    <Divider titlePlacement="start">Presets</Divider>
    <Space wrap>
      {colors.map((color) => (
        <Tooltip title="prompt text" color={color} key={color}>
          <Button>{color}</Button>
        </Tooltip>
      ))}
    </Space>
    <Divider titlePlacement="start">Custom</Divider>
    <Space wrap>
      {customColors.map((color) => (
        <Tooltip title="prompt text" color={color} key={color}>
          <Button>{color}</Button>
        </Tooltip>
      ))}
    </Space>
  </>
);

export default App;
