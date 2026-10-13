import React from 'react';
import { SmileOutlined } from '@fabi/ui/icons';
import { Dropdown } from '@fabi/ui';

const { _InternalPanelDoNotUseOrYouWillBeFired: InternalDropdown } = Dropdown;

const menu = [
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
        2nd menu item (disabled)
      </a>
    ),
    icon: <SmileOutlined />,
    disabled: true,
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://example.com">
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: '4',
    danger: true,
    label: 'a danger item',
  },
];

const App: React.FC = () => <InternalDropdown menu={{ items: menu }} />;

export default App;
