import React from 'react';
import { CarryOutOutlined } from '@fabi/ui/icons';
import { ConfigProvider, Tree } from '@fabi/ui';
import type { TreeDataNode } from '@fabi/ui';

const treeData: TreeDataNode[] = [
  {
    key: 'parent 1',
    title: 'parent 1',
    icon: <CarryOutOutlined />,
    children: [
      {
        key: 'parent 1-0',
        title: 'parent 1-0',
        icon: <CarryOutOutlined />,
        children: [
          {
            key: 'leaf1',
            title: 'leaf1',
            icon: <CarryOutOutlined />,
          },
          {
            key: 'leaf2',
            title: 'leaf2',
            icon: <CarryOutOutlined />,
          },
        ],
      },
      {
        key: 'parent 1-1',
        title: 'parent 1-1',
        icon: <CarryOutOutlined />,
        children: [
          {
            key: 'sss',
            title: 'sss',
            icon: <CarryOutOutlined />,
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Tree: {
            titleHeight: 32,
            switcherSize: 24,
          },
        },
      }}
    >
      <Tree showLine defaultExpandAll treeData={treeData} />
      <Tree showLine defaultExpandAll treeData={treeData} draggable />
      <Tree showLine defaultExpandAll treeData={treeData} checkable />
    </ConfigProvider>
  );
};

export default App;
