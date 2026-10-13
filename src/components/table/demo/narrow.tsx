import React from 'react';
import { Table } from '@fabi/ui';
import type { TableColumnsType } from '@fabi/ui';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

const dataSource = Array.from({ length: 200 }).map<DataType>((_, key) => ({
  key,
  name: 'Sample Name',
  age: 30 + (key % 5),
  address: `Sample Address ${key}`,
}));

const App: React.FC = () => (
  <div style={{ width: 300 }}>
    <Table<DataType> bordered
      columns={columns}
      dataSource={dataSource}
      size="small"
      pagination={{ defaultCurrent: 13 }}
    />
  </div>
);

export default App;
