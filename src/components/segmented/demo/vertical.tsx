import React from 'react';
import { AppstoreOutlined, BarsOutlined } from '@fabi/ui/icons';
import { Segmented } from '@fabi/ui';

const Demo: React.FC = () => (
  <Segmented
    orientation="vertical"
    options={[
      { value: 'List', icon: <BarsOutlined /> },
      { value: 'Kanban', icon: <AppstoreOutlined /> },
    ]}
  />
);

export default Demo;
