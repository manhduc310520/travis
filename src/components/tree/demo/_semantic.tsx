import React from 'react';
import {
  DownOutlined,
  FrownFilled,
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
} from '@fabi/ui/icons';
import { Tree } from '@fabi/ui';
import type { TreeDataNode } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with tree control base styles, layout and container control',
    item: 'Item element with tree node base styles, drag state, role attributes, indentation, switcher, content wrapper and other node structure',
    itemTitle: 'Title element with tree node title text display styles and text content',
    itemIcon: 'Icon element with tree node icon styles, size and state display',
    itemSwitcher: 'Switcher element with tree node expand/collapse button styles and background',
  },
};

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    icon: <SmileOutlined />,
    children: [
      {
        title: 'leaf',
        key: '0-0-0',
        icon: <MehOutlined />,
      },
      {
        title: 'leaf',
        key: '0-0-1',
        icon: ({ selected }) => (selected ? <FrownFilled /> : <FrownOutlined />),
      },
    ],
  },
];
const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Tree"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'item', desc: locale.item, version: '6.0.0' },
        { name: 'itemIcon', desc: locale.itemIcon, version: '6.0.0' },
        { name: 'itemTitle', desc: locale.itemTitle, version: '6.0.0' },
        { name: 'itemSwitcher', desc: locale.itemSwitcher, version: '6.4.0' },
      ]}
    >
      <Tree
        showIcon
        defaultExpandAll
        defaultSelectedKeys={['0-0-0']}
        switcherIcon={<DownOutlined />}
        treeData={treeData}
      />
    </SemanticPreview>
  );
};

export default App;
