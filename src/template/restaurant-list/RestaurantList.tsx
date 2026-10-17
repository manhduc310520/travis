// "Danh sách nhà hàng" (FABi CMS restaurant list, from the design flow "Nhà hàng"): PageHeader without a title
// (breadcrumb, "Tiện ích ▾", one primary "Tạo nhà hàng") → FilterBar (search, city, column settings) → Table in a
// Card (#, status Tags from the DS, vi-VN dates, "Hiển thị 1 - 8 trên tổng số 8", "10 / trang").
// States: data · empty ("Chưa có dữ liệu" + create) · no match ("Không tìm thấy dữ liệu" + clear filters).
// "Tiện ích → Đồng bộ màn hình phụ" opens its modal. Patterns learnt from ProTable (column settings, totals).
import React, { useMemo, useState } from 'react';
import {
  App,
  Button,
  Card,
  Checkbox,
  Dropdown,
  Empty,
  FilterBar,
  Flex,
  Form,
  Input,
  Layout,
  Modal,
  PageHeader,
  Popover,
  Select,
  Table,
  Tag,
  Typography,
  Upload,
  formatDateTime,
  theme,
} from '@fabi/ui';
import type { TableProps, UploadFile } from '@fabi/ui';
import { ChevronDownLine, Columns03Line, HelpCircleLine, ImagePlusLine, PlusLine, SearchSmLine } from '@fabi/ui/fabi-icons';
import AppShell from '../shell/AppShell';
import FillHeight from '../shell/FillHeight';
import { CITIES, LICENSE_STATUS, RESTAURANTS } from '../data/restaurants';
import type { Restaurant } from '../data/restaurants';

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').toLowerCase();

/** "Tiện ích → Đồng bộ màn hình phụ": stores + the background image; "Lưu lại" only once both are set */
const SyncScreenModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { message } = App.useApp();
  const [stores, setStores] = useState<string[]>([]);
  const [image, setImage] = useState<UploadFile[]>([]);
  const ready = stores.length > 0 && image.length > 0;
  const close = () => {
    setStores([]);
    setImage([]);
    onClose();
  };
  return (
    <Modal
      title="Đồng bộ màn hình phụ"
      open={open}
      width={640}
      onCancel={close}
      footer={[
        <Button key="close" onClick={close}>Đóng lại</Button>,
        <Button
          key="save"
          type="primary"
          disabled={!ready}
          onClick={() => {
            void message.success(`Đã đồng bộ màn hình phụ cho ${stores.length} cửa hàng`);
            close();
          }}
        >
          Lưu lại
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Chọn cửa hàng" required>
          <Select
            mode="multiple"
            maxTagCount={2}
            placeholder="Chọn cửa hàng"
            value={stores}
            onChange={setStores}
            options={RESTAURANTS.map((r) => ({ value: r.key, label: r.name }))}
          />
        </Form.Item>
        <Form.Item label="Hình nền trên thiết bị bán hàng" tooltip={{ title: 'Hiện trên màn hình phụ của các cửa hàng đã chọn', icon: <HelpCircleLine /> }} style={{ marginBottom: 0 }}>
          <Upload listType="picture-card" accept="image/*" maxCount={1} fileList={image} beforeUpload={() => false} onChange={({ fileList }) => setImage(fileList)}>
            {image.length === 0 && (
              <Flex vertical align="center" gap="small">
                <ImagePlusLine />
                <span>Thêm ảnh</span>
              </Flex>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export interface RestaurantListProps {
  /** Demo data (default: 24 restaurants; [] shows the empty state) */
  data?: Restaurant[];
  /** Starting search text (shows the "no match" state when nothing matches) */
  initialQuery?: string;
}

const RestaurantListInner: React.FC<RestaurantListProps> = ({ data = RESTAURANTS, initialQuery = '' }) => {
  const { token } = theme.useToken();
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState('all');
  const [syncOpen, setSyncOpen] = useState(false);
  const filtering = query.trim() !== '' || city !== 'all';
  const rows = useMemo(
    () => data.filter((r) => (!query.trim() || fold(`${r.name} ${r.posId} ${r.phone} ${r.email}`).includes(fold(query.trim()))) && (city === 'all' || r.city === city)),
    [data, query, city],
  );

  const allColumns: NonNullable<TableProps<Restaurant>['columns']> = [
    { key: 'index', title: '#', width: 56, align: 'center', render: (_, __, i) => i + 1 },
    { key: 'posId', title: 'Pos ID', dataIndex: 'posId', width: 120 },
    { key: 'name', title: 'Tên nhà hàng', dataIndex: 'name', render: (name: string) => <Typography.Link>{name}</Typography.Link> },
    { key: 'city', title: 'Địa điểm', dataIndex: 'city', width: 120, render: (c: string) => c },
    { key: 'address', title: 'Địa chỉ', dataIndex: 'address' },
    { key: 'phone', title: 'Số điện thoại', dataIndex: 'phone', width: 140 },
    { key: 'email', title: 'Email', dataIndex: 'email' },
    { key: 'licenseUntil', title: 'Thời hạn bản quyền', dataIndex: 'licenseUntil', width: 170, render: (v: string) => formatDateTime(v) },
    {
      key: 'status',
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 140,
      render: (s: Restaurant['status']) => <Tag color={LICENSE_STATUS[s].color} variant="filled">{LICENSE_STATUS[s].label}</Tag>,
    },
  ];
  // column settings (like ProTable's): every column but # can be hidden
  const [hidden, setHidden] = useState<string[]>([]);
  const columns = allColumns.filter((c) => !hidden.includes(String(c.key)));
  const settable = allColumns.filter((c) => c.key !== 'index');
  const columnSettings = (
    <Flex vertical gap="small" style={{ minWidth: 200 }}>
      <Checkbox.Group
        value={settable.map((c) => String(c.key)).filter((k) => !hidden.includes(k))}
        onChange={(shown) => setHidden(settable.map((c) => String(c.key)).filter((k) => !shown.includes(k)))}
      >
        <Flex vertical gap="small">
          {settable.map((c) => (
            <Checkbox key={String(c.key)} value={String(c.key)}>{c.title as string}</Checkbox>
          ))}
        </Flex>
      </Checkbox.Group>
      <Button type="link" size="small" onClick={() => setHidden([])} style={{ alignSelf: 'flex-start', paddingInline: 0 }}>Đặt lại</Button>
    </Flex>
  );

  const clearFilters = () => {
    setQuery('');
    setCity('all');
  };
  const empty = filtering ? (
    // no match: what to do next
    <Empty
      image={<SearchSmLine style={{ fontSize: 40, color: token.colorText }} />}
      styles={{ image: { height: 'auto', marginBottom: token.marginLG } }}
      description={
        <Flex vertical gap="small">
          <Typography.Text strong>Không tìm thấy dữ liệu</Typography.Text>
          <Typography.Text type="secondary">Hãy thay đổi bộ lọc hoặc điều kiện tìm kiếm</Typography.Text>
        </Flex>
      }
      style={{ paddingBlock: token.paddingXL * 2 }}
    >
      <Button type="primary" onClick={clearFilters}>Xoá tìm kiếm và bộ lọc</Button>
    </Empty>
  ) : (
    <Empty description="Chưa có dữ liệu" style={{ paddingBlock: token.paddingXL * 2 }}>
      <Button type="primary" icon={<PlusLine />}>Tạo nhà hàng</Button>
    </Empty>
  );

  return (
    <AppShell selected="restaurant-list">
      <PageHeader
        breadcrumb={[{ title: 'Trang chủ' }, { title: 'Nhà hàng' }, { title: 'Danh sách nhà hàng' }]}
        extra={
          <>
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  { key: 'import', label: 'Nhập Excel' },
                  { key: 'export', label: 'Xuất Excel' },
                  { key: 'print', label: 'In danh sách' },
                  { type: 'divider' },
                  { key: 'sync', label: 'Đồng bộ màn hình phụ' },
                ],
                onClick: (e) => e.key === 'sync' && setSyncOpen(true),
              }}
            >
              <Button icon={<ChevronDownLine />} iconPlacement="end">Tiện ích</Button>
            </Dropdown>
            <Button type="primary" icon={<PlusLine />}>Tạo nhà hàng</Button>
          </>
        }
        footer={
          <FilterBar
            style={{ padding: `0 0 ${token.padding}px`, background: 'transparent' }}
            tools={
              <Popover content={columnSettings} title="Hiển thị cột" trigger="click" placement="bottomLeft">
                <Button icon={<Columns03Line />} aria-label="Chọn cột hiển thị" />
              </Popover>
            }
          >
            <Input allowClear prefix={<SearchSmLine />} placeholder="Tìm kiếm nhà hàng" aria-label="Tìm kiếm nhà hàng" value={query} onChange={(e) => setQuery(e.target.value)} />
            <Select aria-label="Thành phố" value={city} onChange={setCity} options={[{ value: 'all', label: 'Tất cả thành phố' }, ...CITIES]} />
          </FilterBar>
        }
      />
      <Layout.Content style={{ padding: token.padding }}>
        <Card styles={{ body: { padding: 0 } }}>
          <Table<Restaurant>
            rowKey="key"
            columns={columns}
            dataSource={rows}
            // empty / no match: the card reaches the bottom of the screen, the message centred in it
            locale={{ emptyText: <FillHeight>{empty}</FillHeight> }}
            scroll={{ x: 'max-content' }}
            pagination={
              rows.length > 0 && {
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `Hiển thị ${range[0]} - ${range[1]} trên tổng số ${total}`,
                style: { paddingInline: token.padding },
              }
            }
          />
        </Card>
      </Layout.Content>
      <SyncScreenModal open={syncOpen} onClose={() => setSyncOpen(false)} />
    </AppShell>
  );
};

const RestaurantList: React.FC<RestaurantListProps> = (props) => (
  <App>
    <RestaurantListInner {...props} />
  </App>
);

export default RestaurantList;
