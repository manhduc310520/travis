import React from 'react';
import { ColorPicker } from '@fabi/ui';

export default () => {
  const [color, setColor] = React.useState<string>('#0958d9');
  return (
    <ColorPicker
      value={color}
      allowClear
      onChange={(c) => {
        setColor(c.toHexString());
      }}
    />
  );
};
