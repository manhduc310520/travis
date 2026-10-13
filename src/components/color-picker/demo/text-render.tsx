import React, { useState } from 'react';
import { DownOutlined } from '@fabi/ui/icons';
import { ColorPicker, Space } from '@fabi/ui';

const Demo = () => {
  const [open, setOpen] = useState(false);
  return (
    <Space vertical>
      <ColorPicker defaultValue="#0958d9" showText allowClear />
      <ColorPicker
        defaultValue="#0958d9"
        showText={(color) => <span>Custom Text ({color.toHexString()})</span>}
      />
      <ColorPicker
        defaultValue="#0958d9"
        open={open}
        onOpenChange={setOpen}
        showText={() => (
          <DownOutlined
            rotate={open ? 180 : 0}
            style={{
              color: 'rgba(0, 0, 0, 0.25)',
            }}
          />
        )}
      />
    </Space>
  );
};

export default Demo;
