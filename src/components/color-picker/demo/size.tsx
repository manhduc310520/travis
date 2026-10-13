import React from 'react';
import { ColorPicker, Space } from '@fabi/ui';

const Demo = () => (
  <Space>
    <Space vertical>
      <ColorPicker defaultValue="#0958d9" size="small" />
      <ColorPicker defaultValue="#0958d9" />
      <ColorPicker defaultValue="#0958d9" size="large" />
    </Space>
    <Space vertical>
      <ColorPicker defaultValue="#0958d9" size="small" showText />
      <ColorPicker defaultValue="#0958d9" showText />
      <ColorPicker defaultValue="#0958d9" size="large" showText />
    </Space>
  </Space>
);

export default Demo;
