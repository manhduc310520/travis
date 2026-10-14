import React, { useState } from 'react';
import { Button, Skeleton, Space } from '@fabi/ui';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const showSkeleton = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <Space vertical style={{ width: '100%' }} size={16}>
      <Skeleton loading={loading}>
        <h4 style={{ marginBottom: 16 }}>FABi CMS, a back office for restaurants</h4>
        <p>
          Each module comes with short guides, checklists and import templates, so a new branch can set up its menu and tables in a day.
        </p>
      </Skeleton>
      <Button onClick={showSkeleton} disabled={loading}>
        Show Skeleton
      </Button>
    </Space>
  );
};

export default App;
