import React from 'react';
import { Flex, Menu } from '@fabi/ui';
import type { GetProp, MenuProps } from '@fabi/ui';
import { createStaticStyles } from '@fabi/ui/style';

const classNames = createStaticStyles(({ css }) => ({
  root: css`
    border: 1px solid #f0f0f0;
    max-width: 600px;
    padding: 8px;
    border-radius: 4px;
  `,
  item: css`
    color: light-dark(#1677ff, #65a9f3);
  `,
}));

const items: Required<MenuProps>['items'] = [
  {
    key: 'SubMenu',
    label: 'Navigation One',
    children: [
      {
        key: 'g1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' },
        ],
      },
    ],
  },
  { key: 'mail', label: 'Navigation Two' },
];

const styles: MenuProps['styles'] = {
  root: { border: '1px solid #f0f0f0', padding: 8, borderRadius: 4 },
  item: { color: 'light-dark(#0958d9, #65a9f3)' },
  subMenu: { list: { color: 'light-dark(#ad2102, #f3956a)' } },
};

const stylesFn: MenuProps['styles'] = (info): GetProp<MenuProps, 'styles', 'Return'> => {
  const hasSub = info.props.items?.[0];
  return {
    root: {
      backgroundColor: hasSub ? 'light-dark(rgba(240,249,255, 0.6), rgba(255, 255, 255, 0.04))' : 'light-dark(rgba(255,255,255), rgba(255, 255, 255, 0.04))',
    },
  };
};

const App: React.FC = () => {
  const shareProps: MenuProps = {
    classNames,
    items,
  };

  return (
    <Flex vertical gap="medium">
      <Menu {...shareProps} styles={styles} />
      <Menu mode="inline" {...shareProps} styles={stylesFn} />
    </Flex>
  );
};

export default App;
