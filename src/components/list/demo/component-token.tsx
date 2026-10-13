import React from 'react';
import { Avatar, ConfigProvider, Divider, List, Typography } from '@fabi/ui';

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

const data1 = [
  {
    title: 'FABi CMS Title 1',
  },
  {
    title: 'FABi CMS Title 2',
  },
  {
    title: 'FABi CMS Title 3',
  },
  {
    title: 'FABi CMS Title 4',
  },
];

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      components: {
        List: {
          headerBg: 'pink',
          footerBg: 'pink',
          emptyTextPadding: 32,
          itemPadding: '26px',
          itemPaddingSM: '16px',
          itemPaddingLG: '36px',
          metaMarginBottom: 20,
          avatarMarginRight: 20,
          titleMarginBottom: 10,
          descriptionFontSize: 20,
        },
      },
    }}
  >
    <Divider titlePlacement="start">Default Size</Divider>
    <List
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Typography.Text mark>[ITEM]</Typography.Text> {item}
        </List.Item>
      )}
    />
    <Divider titlePlacement="start">Small Size</Divider>
    <List
      size="small"
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={data}
      renderItem={(item) => <List.Item>{item}</List.Item>}
    />
    <Divider titlePlacement="start">Large Size</Divider>
    <List
      size="large"
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={data}
      renderItem={(item) => <List.Item>{item}</List.Item>}
    />
    <Divider titlePlacement="start">Meta</Divider>
    <List
      itemLayout="horizontal"
      dataSource={data1}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar alt="Avatar" src={`/mock-assets/avatar-${(Math.abs(Number(index)) % 12) + 1}.svg`} />}
            title={<a href="https://example.com">{item.title}</a>}
            description="FABi CMS, a design language for background applications, is refined by the FABi CMS team"
          />
        </List.Item>
      )}
    />
    <Divider titlePlacement="start">Vertical</Divider>
    <List
      itemLayout="vertical"
      dataSource={data1}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar alt="Avatar" src={`/mock-assets/avatar-${(Math.abs(Number(index)) % 12) + 1}.svg`} />}
            title={<a href="https://example.com">{item.title}</a>}
            description="FABi CMS, a design language for background applications, is refined by the FABi CMS team"
          />
        </List.Item>
      )}
    />
    <Divider titlePlacement="start">Empty Text</Divider>
    <List />
  </ConfigProvider>
);

export default App;
