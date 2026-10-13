import React from 'react';
import { CustomerServiceOutlined } from '@fabi/ui/icons';
import { FloatButton } from '@fabi/ui';

const App: React.FC = () => (
  <>
    <FloatButton
      shape="circle"
      type="primary"
      style={{ insetInlineEnd: 94 }}
      icon={<CustomerServiceOutlined />}
    />
    <FloatButton
      shape="square"
      type="primary"
      style={{ insetInlineEnd: 24 }}
      icon={<CustomerServiceOutlined />}
    />
  </>
);

export default App;
