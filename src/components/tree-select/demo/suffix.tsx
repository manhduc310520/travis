import React, { useState } from 'react';
import { SmileOutlined } from '@fabi/ui/icons';
import { TreeSelect } from '@fabi/ui';

const icon = <SmileOutlined />;
const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        children: [
          {
            value: 'leaf1',
            title: 'my leaf',
          },
          {
            value: 'leaf2',
            title: 'your leaf',
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        children: [
          {
            value: 'sss',
            title: <b style={{ color: '#08c' }}>sss</b>,
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => {
  const [value, setValue] = useState<string>();

  const onChange = (newValue: string) => {
    console.log(newValue);
    setValue(newValue);
  };

  return (
    <>
      <TreeSelect aria-label="Please select"
        showSearch
        suffixIcon={icon}
        style={{ width: '100%' }}
        value={value}
        styles={{
          popup: {
            root: { maxHeight: 400, overflow: 'auto' },
          },
        }}
        placeholder="Please select"
        allowClear
        treeDefaultExpandAll
        onChange={onChange}
        treeData={treeData}
      />
      <br />
      <br />
      <TreeSelect aria-label="Please select"
        showSearch
        prefix="Prefix"
        style={{ width: '100%' }}
        value={value}
        styles={{
          popup: {
            root: { maxHeight: 400, overflow: 'auto' },
          },
        }}
        placeholder="Please select"
        allowClear
        treeDefaultExpandAll
        onChange={onChange}
        treeData={treeData}
      />
    </>
  );
};

export default App;
