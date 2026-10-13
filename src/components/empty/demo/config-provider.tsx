import React, { useState } from 'react';
import { SmileOutlined } from '@fabi/ui/icons';
import {
  Cascader,
  ConfigProvider,
  Divider,
  List,
  Select,
  Space,
  Switch,
  Table,
  Transfer,
  TreeSelect,
} from '@fabi/ui';

const customizeRenderEmpty = () => (
  <div style={{ textAlign: 'center' }}>
    <SmileOutlined style={{ fontSize: 20 }} />
    <p>Data Not Found</p>
  </div>
);

const style: React.CSSProperties = { width: 200 };

const App: React.FC = () => {
  const [customize, setCustomize] = useState(true);
  return (
    <>
      <Switch aria-label="Switch"
        unCheckedChildren="default"
        checkedChildren="customize"
        checked={customize}
        onChange={setCustomize}
      />
      <Divider />
      <ConfigProvider renderEmpty={customize ? customizeRenderEmpty : undefined}>
        <Space vertical style={{ width: '100%' }}>
          <h4>Select</h4>
          <Select aria-label="Select" style={style} />
          <h4>TreeSelect</h4>
          <TreeSelect aria-label="Select" style={style} treeData={[]} />
          <h4>Cascader</h4>
          <Cascader aria-label="Select" style={style} options={[]} showSearch />
          <h4>Transfer</h4>
          <Transfer />
          <h4>Table</h4>
          <Table
            style={{ marginTop: 8 }}
            columns={[
              { title: 'Name', dataIndex: 'name', key: 'name' },
              { title: 'Age', dataIndex: 'age', key: 'age' },
            ]}
          />
          <h4>List</h4>
          <List />
        </Space>
      </ConfigProvider>
    </>
  );
};

export default App;
