// Detail page (a restaurant): PageHeader without a title (breadcrumb + actions, one primary), tabs in the header →
// Tabs: details in Descriptions (bordered, 2 columns from md) and the change history in a Timeline.
import React from 'react';
import { Button, Card, Col, Descriptions, Flex, PageHeader, Row, Tabs, Timeline, Typography, Tag, formatDateTime, theme } from '@fabi/ui';
import { Edit01Line } from '@fabi/ui/fabi-icons';
import AppShell, { useIsPhone } from '../shell/AppShell';
import { CITIES, LICENSE_STATUS, RESTAURANTS } from '../data/restaurants';

const restaurant = RESTAURANTS[0];
const HISTORY = [
  { at: '2026-10-13T09:12:00', who: 'Chanh dev', what: 'Gia hạn bản quyền đến 14/03/2026' },
  { at: '2026-10-10T15:40:00', who: 'Lan Anh', what: 'Đổi đối tác xuất HĐĐT sang FABI' },
  { at: '2026-10-02T08:05:00', who: 'Chanh dev', what: 'Tạo nhà hàng' },
];

const DetailPage: React.FC = () => {
  const { token } = theme.useToken();
  const phone = useIsPhone();
  const status = LICENSE_STATUS[restaurant.status];
  const tag = <Tag color={status.color} variant="filled">{status.label}</Tag>;
  const details = (
    <Row gutter={[token.margin, token.margin]}>
      <Col xs={24} xl={16}>
        <Card title="Thông tin">
          <Descriptions
            bordered
            column={phone ? 1 : 2}
            items={[
              { key: 'posId', label: 'Pos ID', children: restaurant.posId },
              { key: 'city', label: 'Thành phố', children: CITIES.find((c) => c.value === restaurant.city)?.label },
              { key: 'address', label: 'Địa chỉ', span: phone ? 1 : 2, children: restaurant.address },
              { key: 'phone', label: 'Số điện thoại', children: restaurant.phone },
              { key: 'email', label: 'Email', children: restaurant.email },
              { key: 'license', label: 'Thời hạn bản quyền', children: formatDateTime(restaurant.licenseUntil) },
              { key: 'status', label: 'Trạng thái', children: tag },
            ]}
          />
        </Card>
      </Col>
      <Col xs={24} xl={8}>
        <Card title="Thiết bị">
          <Flex vertical gap="small">
            {['POS 2 màn hình', 'KDS bếp', 'PDA phục vụ'].map((r) => (
              <Typography.Text key={r}>{r}</Typography.Text>
            ))}
          </Flex>
        </Card>
      </Col>
    </Row>
  );
  const historyTab = (
    <Card>
      <Timeline
        items={HISTORY.map((h) => ({
          children: (
            <Flex vertical>
              <Typography.Text>{h.what}</Typography.Text>
              <Typography.Text type="secondary">
                {h.who} · {formatDateTime(h.at)}
              </Typography.Text>
            </Flex>
          ),
        }))}
      />
    </Card>
  );
  return (
    <AppShell selected="restaurant-list">
      {/* like "Tạo nhà hàng": no title row, the breadcrumb and the actions share one row (the last breadcrumb item
          is the page's h1 for screen readers), the tabs sit in the white header right under it */}
      <PageHeader
        breadcrumb={[{ title: 'Trang chủ' }, { title: 'Nhà hàng' }, { title: 'Danh sách nhà hàng' }, { title: restaurant.name }]}
        extra={
          <>
            <Button danger>Xoá</Button>
            <Button type="primary" icon={<Edit01Line />}>Sửa</Button>
          </>
        }
        style={{ borderBottom: 0, paddingBottom: 0 }}
      />
      <Tabs
        styles={{ body: { padding: token.padding } }}
        tabBarStyle={{ margin: 0, paddingInline: token.padding, background: token.colorBgContainer, borderBottom: `${token.lineWidth}px solid ${token.colorBorderSecondary}` }}
        items={[
          { key: 'info', label: 'Thông tin', children: details },
          { key: 'history', label: 'Lịch sử thay đổi', children: historyTab },
        ]}
      />
    </AppShell>
  );
};

export default DetailPage;
