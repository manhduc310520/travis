import React from 'react';
import type { MenuProps } from '@fabi/ui';
import { Button, Dropdown, Space } from '@fabi/ui';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://example.com">
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://example.com">
        2nd menu item
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://example.com">
        3rd menu item
      </a>
    ),
  },
];

const App: React.FC = () => (
  <Space vertical>
    <Space wrap>
      <Dropdown menu={{ items }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
        <Button>bottomLeft</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="bottom" arrow={{ pointAtCenter: true }}>
        <Button>bottom</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
        <Button>bottomRight</Button>
      </Dropdown>
    </Space>
    <Space wrap>
      <Dropdown menu={{ items }} placement="topLeft" arrow={{ pointAtCenter: true }}>
        <Button>topLeft</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="top" arrow={{ pointAtCenter: true }}>
        <Button>top</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="topRight" arrow={{ pointAtCenter: true }}>
        <Button>topRight</Button>
      </Dropdown>
    </Space>
  </Space>
);

export default App;
