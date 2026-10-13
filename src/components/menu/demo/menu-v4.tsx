import React, { useState } from 'react';
import {
  AppstoreOutlined,
  CalendarOutlined,
  LinkOutlined,
  MailOutlined,
  SettingOutlined,
} from '@fabi/ui/icons';
import { ConfigProvider, Menu, Switch, Typography } from '@fabi/ui';
import type { MenuProps } from '@fabi/ui';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: '1',
    icon: <MailOutlined />,
    label: 'Navigation One',
  },
  {
    key: '2',
    icon: <CalendarOutlined />,
    label: 'Navigation Two',
  },
  {
    key: 'sub1',
    icon: <AppstoreOutlined />,
    label: 'Navigation Two',
    children: [
      {
        key: '3',
        label: (
          <Typography.Text ellipsis>
            FABi CMS, a design language for background applications, is refined by the FABi CMS team
          </Typography.Text>
        ),
      },
      {
        key: '4',
        label: 'Option 4',
      },
      {
        key: 'sub1-2',
        label: 'Submenu',
        children: [
          { key: '5', label: 'Option 5' },
          { key: '6', label: 'Option 6' },
        ],
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Three',
    icon: <SettingOutlined />,
    children: [
      { label: 'Option 7', key: '7' },
      { label: 'Option 8', key: '8' },
      { label: 'Option 9', key: '9' },
      { label: 'Option 10', key: '10' },
    ],
  },
  {
    key: 'link',
    icon: <LinkOutlined />,
    label: (
      <a href="https://example.com" target="_blank" rel="noopener noreferrer">
        FABi CMS
      </a>
    ),
  },
];

const App: React.FC = () => {
  const [mode, setMode] = useState<'vertical' | 'inline'>('inline');

  const changeMode = (value: boolean) => {
    setMode(value ? 'vertical' : 'inline');
  };

  return (
    <>
      <Switch aria-label="Switch" onChange={changeMode} /> Change Mode
      <br />
      <br />
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemBorderRadius: 0,
              subMenuItemBorderRadius: 0,
              itemHoverColor: '#0958d9',
              itemSelectedColor: '#0958d9',
              itemSelectedBg: '#e6f7ff',
              activeBarWidth: 3,
              itemMarginInline: 0,
              itemHoverBg: 'transparent',
            },
          },
        }}
      >
        <Menu
          style={{ width: 256 }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode={mode}
          items={items}
        />
      </ConfigProvider>
    </>
  );
};

export default App;
