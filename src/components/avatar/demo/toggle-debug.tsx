import React, { useState } from 'react';
import { Avatar, Button, Space } from '@fabi/ui';

type SizeType = 'large' | 'small' | 'medium' | number;

const App: React.FC = () => {
  const [hide, setHide] = useState(true);
  const [size, setSize] = useState<SizeType>('large');
  const [scale, setScale] = useState(1);

  const toggle = () => {
    setHide(!hide);
  };

  const toggleSize = () => {
    const sizes = ['small', 'medium', 'large'] as SizeType[];
    let current = sizes.indexOf(size) + 1;
    if (current > 2) {
      current = 0;
    }
    setSize(sizes[current]);
  };

  const changeScale = () => {
    setScale(scale === 1 ? 2 : 1);
  };

  return (
    <>
      <Space wrap>
        <Button onClick={toggle}>Toggle Avatar visibility</Button>
        <Button onClick={toggleSize}>Toggle Avatar size</Button>
        <Button onClick={changeScale}>Change Avatar scale</Button>
      </Space>
      <div style={{ textAlign: 'center', transform: `scale(${scale})`, marginTop: 24 }}>
        <Avatar size={size} style={{ background: '#531dab', display: hide ? 'none' : '' }}>
          Avatar
        </Avatar>
        <Avatar alt="Avatar"
          size={size}
          src="invalid"
          style={{ background: '#006d75', display: hide ? 'none' : '' }}
        >
          Invalid
        </Avatar>
        <div style={{ display: hide ? 'none' : '' }}>
          <Avatar size={size} style={{ background: '#531dab' }}>
            Avatar
          </Avatar>
          <Avatar alt="Avatar" size={size} src="invalid" style={{ background: '#006d75' }}>
            Invalid
          </Avatar>
        </div>
      </div>
    </>
  );
};

export default App;
