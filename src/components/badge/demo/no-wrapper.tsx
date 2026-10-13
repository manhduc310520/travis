import React, { useState } from 'react';
import { ClockCircleOutlined } from '@fabi/ui/icons';
import { Badge, Space, Switch } from '@fabi/ui';

const App: React.FC = () => {
  const [show, setShow] = useState(true);

  return (
    <Space>
      <Switch aria-label="Show badge counts" checked={show} onChange={() => setShow(!show)} />
      <Badge count={show ? 11 : 0} showZero color="#ad4e00" />
      <Badge count={show ? 25 : 0} />
      <Badge count={show ? <ClockCircleOutlined style={{ color: '#f5222d' }} /> : 0} />
      <Badge
        className="site-badge-count-109"
        count={show ? 109 : 0}
        style={{ backgroundColor: '#237804' }}
      />
    </Space>
  );
};

export default App;
