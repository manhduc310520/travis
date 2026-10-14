import React from 'react';
import { AppstoreOutlined, MailOutlined } from '@fabi/ui/icons';
import { Flex, Menu, Segmented } from '@fabi/ui';
import type { MenuProps } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

type MenuItem = Required<MenuProps>['items'][number];

const locales = {
  en: {
    root: 'Root element with basic menu container styles and layout',
    item: 'Item element with relative positioning, block display, margins, whitespace handling, cursor styles, transitions and other basic interactive styles for menu items',
    itemContent: 'Item content element with layout and typography styles for menu item content',
    itemIcon:
      'Icon element with min-width, font-size, transitions, icon reset styles, and spacing control with text',
    itemTitle:
      'Item title element (no effect in horizontal mode) with title text styles and layout',
    list: 'Menu list element (no effect in horizontal mode) with menu list layout and container styles',
    popup:
      'Popup menu element (no effect in inline mode) with popup layer positioning, z-index, background and other styles',
    'subMenu.itemTitle': 'Submenu title element with submenu title styles and interactive effects',
    'subMenu.list': 'Submenu list element with submenu list layout and container styles',
    'subMenu.item': 'Submenu item element with submenu item styles and interactive effects',
    'subMenu.itemIcon': 'Submenu item icon element with submenu icon size and styles',
    'subMenu.itemContent':
      'Submenu item content element with submenu content layout and typography',
  },
};
const items: MenuItem[] = [
  {
    label: 'Navigation One',
    key: 'mail',
    icon: <MailOutlined />,
  },
  {
    key: 'SubMenu',
    label: 'Navigation Two',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: 'g1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '1', label: 'Option 1', icon: <MailOutlined /> },
          { key: '2', label: 'Option 2' },
        ],
      },
    ],
  },
];

const groupItem: MenuItem[] = [
  {
    key: 'grp',
    label: 'Navigation Three',
    type: 'group',
    children: [
      { key: '3', label: 'Option 3' },
      { key: '4', label: 'Option 4' },
    ],
  },
];

type ModeType = 'horizontal' | 'vertical' | 'inline';

interface ExternalProps {
  item: MenuItem[];
  setMode: React.Dispatch<React.SetStateAction<ModeType>>;
}

const Block: React.FC<MenuProps & ExternalProps> = (props) => {
  const { mode, setMode, item, ...restProps } = props;

  const divRef = React.useRef<HTMLDivElement>(null);
  const [current, setCurrent] = React.useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const getPopupContainer = React.useCallback<NonNullable<MenuProps['getPopupContainer']>>(
    () => divRef.current?.parentElement?.parentElement || divRef.current!,
    [],
  );

  return (
    <Flex vertical gap="medium" ref={divRef} align="center">
      <Segmented<ModeType> options={['horizontal', 'vertical', 'inline']} onChange={setMode} />
      <div style={{ height: 360 }}>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode={mode}
          items={item}
          styles={{
            root: {
              width: mode === 'horizontal' ? 480 : 230,
            },
            popup: {
              root: {
                zIndex: 1,
              },
            },
          }}
          {...restProps}
          openKeys={['SubMenu']}
          getPopupContainer={getPopupContainer}
        />
      </div>
    </Flex>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  const [mode, setMode] = React.useState<ModeType>('horizontal');

  const semantics = React.useMemo(() => {
    const baseLocale = [
      { name: 'root', desc: locale.root },
      { name: 'item', desc: locale.item },
      { name: 'itemIcon', desc: locale.itemIcon },
      { name: 'itemContent', desc: locale.itemContent },
    ];
    const subMenuLocale = [
      { name: 'subMenu.itemTitle', desc: locale['subMenu.itemTitle'] },
      { name: 'subMenu.list', desc: locale['subMenu.list'] },
      { name: 'subMenu.item', desc: locale['subMenu.item'] },
      { name: 'subMenu.itemIcon', desc: locale['subMenu.itemIcon'] },
      { name: 'subMenu.itemContent', desc: locale['subMenu.itemContent'] },
    ];
    const groupLocale = [
      { name: 'itemTitle', desc: locale.itemTitle },
      { name: 'list', desc: locale.list },
    ];

    const additionalPopupLocale = mode !== 'inline' ? [{ name: 'popup', desc: locale.popup }] : [];
    const additionalGroupLocale = mode !== 'horizontal' ? groupLocale : [];

    return [...baseLocale, ...additionalGroupLocale, ...additionalPopupLocale, ...subMenuLocale];
  }, [mode, locale]);

  const itemList = React.useMemo(() => {
    return mode === 'horizontal' ? items : [...items, ...groupItem];
  }, [mode]);

  return (
    <SemanticPreview componentName="Menu" semantics={semantics}>
      <Block mode={mode} setMode={setMode} item={itemList} />
    </SemanticPreview>
  );
};

export default App;
