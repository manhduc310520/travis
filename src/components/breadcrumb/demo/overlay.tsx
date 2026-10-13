import React from 'react';
import { Breadcrumb } from '@fabi/ui';

const menuItems = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://example.com">
        General
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://example.com">
        Layout
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://example.com">
        Navigation
      </a>
    ),
  },
];

const App: React.FC = () => (
  <Breadcrumb
    items={[
      {
        title: 'FABi CMS',
      },
      {
        title: <a href="">Component</a>,
      },
      {
        title: <a href="">General</a>,
        menu: { items: menuItems },
      },
      {
        title: 'Button',
      },
    ]}
  />
);

export default App;
