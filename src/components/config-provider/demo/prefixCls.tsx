import React, { useState } from 'react';
import { SmileOutlined } from '@fabi/ui/icons';
import { Button, Checkbox, ConfigProvider, Radio, Select } from '@fabi/ui';

// FABi CMS site use `es` module for view
// but do not replace related lib `lib` with `es`
// which do not show correct in site.
// We may need do convert in site also.
const App: React.FC = () => {
  const [prefixCls, setPrefixCls] = useState('light');
  return (
    <>
      <Button
        style={{ marginBottom: 12 }}
        type="primary"
        onClick={() => setPrefixCls(prefixCls === 'light' ? 'dark' : 'light')}
      >
        toggle prefixCls
      </Button>
      <br />
      <ConfigProvider prefixCls={prefixCls} iconPrefixCls="bamboo">
        <SmileOutlined />
        <Select aria-label="Select" style={{ width: 120 }} />
        <Radio>test</Radio>
        <Checkbox>test</Checkbox>
      </ConfigProvider>
    </>
  );
};

export default App;
