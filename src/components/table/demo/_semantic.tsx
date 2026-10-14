import React from 'react';
import { Table } from '@fabi/ui';
import type { TableColumnsType, TableProps } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with font-size, background, border-radius, scrollbar-color and other basic table container styles',
    section:
      'Container element with clear-fix, max-width, scrollbar background and other table wrapper styles',
    'header.wrapper': 'Header wrapper element with table header layout and container styles',
    'header.row': 'Header row element with table header row layout and styling',
    'header.cell':
      'Header cell element with relative positioning, padding, word-wrap, background, text color, font-weight and other header cell styles',
    title: 'Title element with table title styling and layout',
    'body.wrapper': 'Body wrapper element with table body layout and container styles',
    'body.row':
      'Body row element with hover effects, selected states, expanded states and other interactive row styles',
    'body.cell':
      'Body cell element with relative positioning, padding, word-wrap and other basic data cell styles',
    footer: 'Footer element with table footer background color, text color and other footer styles',
    content: 'Content element with table content area styling and layout',
    'pagination.root': 'Pagination root element with pagination component basic styles and layout',
    'pagination.item':
      'Pagination item element with pagination item styling and interactive effects',
  },
};

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Personal Info',
    children: [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
    ],
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'thinkasany',
    age: 24,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '5',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '6',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
];

const Block: React.FC<TableProps<DataType>> = (props) => {
  return (
    <Table<DataType>
      bordered
      style={{ width: '100%' }}
      columns={columns}
      dataSource={data}
      size="medium"
      pagination={{ pageSize: 3 }}
      title={() => <>table title</>}
      footer={() => <>table footer</>}
      {...props}
    />
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  return (
    <SemanticPreview
      componentName="Table"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'title', desc: locale.title },
        { name: 'content', desc: locale.content },
        { name: 'header.wrapper', desc: locale['header.wrapper'] },
        { name: 'header.row', desc: locale['header.row'] },
        { name: 'header.cell', desc: locale['header.cell'] },
        { name: 'section', desc: locale.section },
        { name: 'body.wrapper', desc: locale['body.wrapper'] },
        { name: 'body.row', desc: locale['body.row'] },
        { name: 'body.cell', desc: locale['body.cell'] },
        { name: 'footer', desc: locale.footer },
        { name: 'pagination.root', desc: locale['pagination.root'] },
        { name: 'pagination.item', desc: locale['pagination.item'] },
      ]}
    >
      <Block />
    </SemanticPreview>
  );
};

export default App;
