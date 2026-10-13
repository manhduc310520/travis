import React from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@fabi/ui/icons';
import { Card, ConfigProvider } from '@fabi/ui';

export default () => (
  <ConfigProvider
    theme={{
      components: {
        Card: {
          headerBg: '#0958d9',
          bodyPaddingSM: 22,
          headerPaddingSM: 20,
          headerPadding: 18,
          bodyPadding: 26,
          headerFontSize: 20,
          headerFontSizeSM: 20,
          headerHeight: 60,
          headerHeightSM: 60,
          actionsBg: '#0958d9',
          actionsLiMargin: `2px 0`,
          tabsMarginBottom: 0,
          extraColor: 'rgba(0,0,0,0.25)',
        },
      },
    }}
  >
    <Card
      title="Card title"
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
      extra="More"
      tabList={[
        {
          key: 'tab1',
          label: 'tab1',
        },
        {
          key: 'tab2',
          label: 'tab2',
        },
      ]}
    >
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
    <Card size="small" title="Small size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  </ConfigProvider>
);
