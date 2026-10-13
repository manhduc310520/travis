import React, { useState } from 'react';
import { ColorPicker, Space } from '@fabi/ui';
import type { ColorPickerProps, GetProp } from '@fabi/ui';

type Color = GetProp<ColorPickerProps, 'value'>;

const Demo: React.FC = () => {
  const [color, setColor] = useState<Color>('#0958d9');

  return (
    <Space>
      <ColorPicker value={color} onChange={setColor} />
      <ColorPicker value={color} onChangeComplete={setColor} />
    </Space>
  );
};

export default Demo;
