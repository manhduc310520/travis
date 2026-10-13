// "Tạo nhà hàng" (FABi CMS restaurant form, from the design flow "Nhà hàng"): PageHeader without a title
// (breadcrumb, "Trở lại", one primary "Lưu lại") → Tabs (Thông tin chi tiết · Thiết bị · Cấu hình nâng cao) →
// two columns of Cards (one column below lg). Learnt from ProForm: "Lưu lại" is disabled until something changes
// and spins while saving; a failed save scrolls to the first error and shows the error Alert, a good one the
// success Alert; linked fields (VAT % only with a VAT type, the QR follows the bank account); leaving with
// unsaved changes asks first.
import React, { useState } from 'react';
import {
  Alert,
  App,
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  PageHeader,
  QRCode,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  Tooltip,
  Typography,
  Upload,
  theme,
} from '@fabi/ui';
import type { UploadFile } from '@fabi/ui';
import { HelpCircleLine, ImagePlusLine, Trash01Line } from '@fabi/ui/fabi-icons';
import AppShell from '../shell/AppShell';
import { BANKS, CITIES } from '../data/restaurants';

/** "?" after a label: the explanation in a Tooltip */
const Hint: React.FC<{ title: string }> = ({ title }) => (
  <Tooltip title={title}>
    <HelpCircleLine title={title} style={{ marginInlineStart: 4 }} />
  </Tooltip>
);

/** A wide image drop zone that shows the chosen image (POS backgrounds) */
const ImageDrop: React.FC<{ label: string; ratio: string; value?: UploadFile[]; onChange?: (files: UploadFile[]) => void }> = ({ label, ratio, value = [], onChange }) => {
  const { token } = theme.useToken();
  const file = value[0];
  const src = file?.originFileObj ? URL.createObjectURL(file.originFileObj) : file?.url;
  return (
    <div style={{ position: 'relative' }}>
      <Upload.Dragger accept="image/*" showUploadList={false} beforeUpload={() => false} onChange={({ file: f }) => onChange?.([f])} style={{ aspectRatio: ratio }}>
        {src ? (
          <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: token.borderRadius }} />
        ) : (
          <Flex vertical align="center" justify="center" gap="small" style={{ height: '100%' }}>
            <ImagePlusLine style={{ fontSize: token.fontSizeLG }} />
            <span>Thêm ảnh</span>
          </Flex>
        )}
      </Upload.Dragger>
      {src && (
        <Button
          size="small"
          danger
          icon={<Trash01Line />}
          aria-label={`Xoá ${label.toLowerCase()}`}
          onClick={() => onChange?.([])}
          style={{ position: 'absolute', top: token.paddingXS, right: token.paddingXS }}
        />
      )}
    </div>
  );
};

const RestaurantFormInner: React.FC = () => {
  const { token } = theme.useToken();
  const { modal } = App.useApp();
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const vatType = Form.useWatch('vatType', form);
  const bank = Form.useWatch('bank', form);
  const account = Form.useWatch('account', form);
  const accountName = Form.useWatch('accountName', form);

  const save = async () => {
    try {
      await form.validateFields();
    } catch (e) {
      setResult('error');
      const first = (e as { errorFields?: { name: (string | number)[] }[] }).errorFields?.[0];
      if (first) form.scrollToField(first.name, { block: 'center' });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setDirty(false);
      setResult('success');
    }, 600);
  };
  const back = () => {
    if (!dirty) return history.back();
    modal.confirm({
      title: 'Bỏ các thay đổi chưa lưu?',
      content: 'Thông tin bạn vừa nhập sẽ không được lưu.',
      okText: 'Bỏ thay đổi',
      okButtonProps: { danger: true },
      cancelText: 'Ở lại',
      onOk: () => history.back(),
    });
  };

  const details = (
    <Row gutter={[token.margin, token.margin]}>
      <Col xs={24} lg={15}>
        <Flex vertical gap={token.margin}>
          <Card title="Thông tin chi tiết">
            <Form.Item name="name" label="Tên điểm" rules={[{ required: true }]}>
              <Input placeholder="Nhập tên điểm" />
            </Form.Item>
            <Form.Item name="vatType" label="Loại VAT">
              <Select
                options={[
                  { value: 'none', label: 'Không tính VAT' },
                  { value: 'bill', label: 'VAT theo hoá đơn' },
                  { value: 'item', label: 'VAT theo món' },
                ]}
              />
            </Form.Item>
            <Form.Item name="city" label="Thành phố" rules={[{ required: true }]}>
              <Select placeholder="Chọn thành phố" options={CITIES} />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
            <Form.Item name="splitBill" label="Cấu hình in tách hoá đơn khi chọn VAT theo món">
              <Select
                options={[
                  { value: 'manual', label: 'Không tự động tách hoá đơn khi thanh toán' },
                  { value: 'auto', label: 'Tự động tách hoá đơn khi thanh toán' },
                ]}
              />
            </Form.Item>
            <Form.Item name="einvoice" label="Đối tác xuất HĐĐT">
              <Select
                options={[
                  { value: 'fabi', label: 'FABI (Lưu thông tin hoá đơn điện tử)' },
                  { value: 'viettel', label: 'Viettel S-Invoice' },
                  { value: 'minvoice', label: 'M-Invoice' },
                  { value: 'misa', label: 'Misa Me-Invoice' },
                ]}
              />
            </Form.Item>
            <Form.Item label={<>VAT<Hint title="Thuế suất áp dụng khi tính VAT" /></>}>
              <Space.Compact block>
                {/* only with a VAT type (linked field) */}
                <Form.Item name="vat" noStyle>
                  <InputNumber min={0} max={100} disabled={vatType === 'none'} aria-label="VAT" style={{ width: '100%' }} />
                </Form.Item>
                <Space.Addon>%</Space.Addon>
              </Space.Compact>
            </Form.Item>
            <Form.Item name="network" label={<>Cấu hình kết nối thiết bị nội bộ qua mạng<Hint title="Cách các thiết bị bán hàng trong cửa hàng kết nối với nhau" /></>}>
              <Radio.Group options={[{ value: 'lan', label: 'LAN' }, { value: 'internet', label: 'LAN + Internet' }]} />
            </Form.Item>
            <Form.Item name="description" label="Mô tả" style={{ marginBottom: 0 }}>
              <Input.TextArea rows={2} placeholder="Nhập mô tả" />
            </Form.Item>
          </Card>
          <Card title="Cấu hình VietQR">
            <Form.Item name="bank" label="Danh sách ngân hàng">
              <Select placeholder="Chọn ngân hàng" options={BANKS} />
            </Form.Item>
            <Form.Item name="account" label="Số tài khoản" rules={[{ pattern: /^\d{6,19}$/, message: 'Số tài khoản gồm 6–19 chữ số' }]}>
              <Input inputMode="numeric" placeholder="Nhập số tài khoản" />
            </Form.Item>
            <Form.Item name="accountName" label="Tên tài khoản" normalize={(v: string) => v?.toUpperCase()}>
              <Input placeholder="Nhập tên tài khoản" />
            </Form.Item>
            <Flex vertical gap="small" style={{ width: 240 }}>
              {/* the QR follows the bank account (linked fields) */}
              <QRCode
                value={bank && account ? `${bank}|${account}|${accountName ?? ''}` : '-'}
                status={bank && account ? 'active' : 'expired'}
                statusRender={() => <Typography.Text type="secondary">Nhập ngân hàng và số tài khoản</Typography.Text>}
                size={240}
                bordered
                aria-label="Mã VietQR của tài khoản"
              />
              <Button block disabled={!bank || !account}>Lấy QR</Button>
            </Flex>
          </Card>
          <Card title="Thông tin khác">
            <Form.Item name="facebook" label="Facebook" rules={[{ type: 'url', message: 'Liên kết chưa đúng' }]}>
              <Input placeholder="Dán liên kết Facebook" />
            </Form.Item>
            <Form.Item name="website" label="Website" rules={[{ type: 'url', message: 'Liên kết chưa đúng' }]} style={{ marginBottom: 0 }}>
              <Input placeholder="Dán liên kết website" />
            </Form.Item>
          </Card>
        </Flex>
      </Col>
      <Col xs={24} lg={9}>
        <Flex vertical gap={token.margin}>
          <Card title="Hoạt động cửa hàng">
            <Flex align="center" gap="small">
              <Typography.Text id="active-label">Đang hoạt động</Typography.Text>
              <Form.Item name="active" valuePropName="checked" noStyle>
                <Switch aria-labelledby="active-label" />
              </Form.Item>
            </Flex>
          </Card>
          <Card title="Xây dựng thương hiệu">
            <Form.Item name="logo" label="Logo" valuePropName="fileList" getValueFromEvent={(e: { fileList: UploadFile[] }) => e.fileList} extra="Kích thước tối thiểu 300×300 px">
              <Upload listType="picture-card" accept="image/*" maxCount={1} beforeUpload={() => false}>
                <Flex vertical align="center" gap="small">
                  <ImagePlusLine />
                  <span>Thêm ảnh</span>
                </Flex>
              </Upload>
            </Form.Item>
            <Form.Item name="posBackground" label="Hình nền trên thiết bị bán hàng" extra="Hình này hiện trên màn hình 2 của thiết bị POS 2 màn hình. Kích thước đề xuất 1920×1080 px">
              <ImageDrop label="Hình nền trên thiết bị bán hàng" ratio="16 / 9" />
            </Form.Item>
            <Form.Item name="secondBackground" label="Hình nền trên màn hình thứ 2" extra="Hình này hiện trên màn hình 2 ở bước chốt bill. Kích thước đề xuất 1280×1080 px" style={{ marginBottom: 0 }}>
              <ImageDrop label="Hình nền trên màn hình thứ 2" ratio="32 / 27" />
            </Form.Item>
          </Card>
          <Card title="Cấu hình in tạm tính, chốt đồ">
            <Form.Item name="printMode" noStyle>
              <Radio.Group
                aria-label="Cấu hình in tạm tính, chốt đồ"
                options={[
                  { value: 'draft', label: 'In tạm tính' },
                  { value: 'kitchen', label: 'In chốt đồ' },
                  { value: 'both', label: 'In chốt đồ & tạm tính' },
                  { value: 'none', label: 'Không in tạm tính, chốt đồ' },
                ]}
                style={{ display: 'flex', flexDirection: 'column', gap: token.marginSM }}
              />
            </Form.Item>
          </Card>
        </Flex>
      </Col>
    </Row>
  );

  const checks = (items: { name: string; label: string; hint?: string }[]) => (
    <Flex vertical gap={token.marginSM}>
      {items.map((it) => (
        <Flex key={it.name} align="center">
          <Form.Item name={it.name} valuePropName="checked" noStyle>
            <Checkbox>{it.label}</Checkbox>
          </Form.Item>
          {it.hint && <Hint title={it.hint} />}
        </Flex>
      ))}
    </Flex>
  );

  const advanced = (
    <Row gutter={[token.margin, token.margin]}>
      <Col xs={24} lg={14}>
        <Flex vertical gap={token.margin}>
          <Card title="Mô hình hoạt động">
            <Form.Item name="voidMode" noStyle>
              <Radio.Group aria-label="Mô hình hoạt động" style={{ display: 'flex', flexDirection: 'column', gap: token.margin }}>
                {[
                  { value: 'allow', label: 'Cho phép thu ngân bỏ món', desc: 'Thu ngân được bỏ món ngay cả sau khi in tạm tính' },
                  { value: 'limit', label: 'Giới hạn quyền bỏ món của thu ngân', desc: 'Thu ngân được bỏ món nhưng không bỏ được món đã in tạm tính, và không thêm được voucher sau khi in tạm tính' },
                  { value: 'deny', label: 'Không cho phép thu ngân bỏ món', desc: 'Mọi yêu cầu bỏ món cần quản lý đồng ý' },
                ].map((o) => (
                  <Radio key={o.value} value={o.value}>
                    <Flex vertical>
                      <span>{o.label}</span>
                      <Typography.Text type="secondary">{o.desc}</Typography.Text>
                    </Flex>
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Card>
          <Card title="Cấu hình voucher và hội viên">
            {checks([
              { name: 'pointsToVoucher', label: 'Đổi điểm lấy voucher' },
              { name: 'memberVouchers', label: 'Xem voucher của thành viên' },
              { name: 'noPhoneCheckin', label: 'Không check-in bằng số điện thoại' },
              { name: 'multiDiscount', label: 'Cho phép dùng nhiều mã giảm giá trong 1 đơn hàng' },
              { name: 'crmSearch', label: 'Tìm hội viên CRM theo tên hoặc số điện thoại', hint: 'Tìm trong danh sách hội viên của hệ thống CRM' },
            ])}
          </Card>
          <Card title="Cấu hình nhà hàng buffet">
            {checks([
              { name: 'buffet', label: 'Nhà hàng buffet' },
              { name: 'buffetTicket', label: 'Bắt buộc phải chọn vé buffet' },
            ])}
          </Card>
          <Card title="Thiết lập đặc biệt">
            {checks([
              { name: 'virtualItems', label: 'Cấu hình món ảo', hint: 'Món không có trong thực đơn, dùng để tính phí phụ' },
              { name: 'buffetItems', label: 'Cấu hình món ăn là vé buffet', hint: 'Món được bán như vé vào buffet' },
            ])}
            <Typography.Text strong style={{ display: 'block', marginBlock: token.marginSM }}>Cấu hình sửa giá, nhập số lượng</Typography.Text>
            {checks([
              { name: 'editPrice', label: 'Cho phép sửa giá khi bán', hint: 'Thu ngân sửa được giá món ngay trên POS' },
              { name: 'askQuantity', label: 'Yêu cầu nhập số lượng khi gọi đồ' },
              { name: 'voidWithoutRight', label: 'Cho phép bỏ món mà không cần quyền áp dụng', hint: 'Không cần quản lý duyệt khi bỏ món' },
              { name: 'voidBeforeDraft', label: 'Chỉ cho phép bỏ món không cần quyền trước khi in tạm tính' },
            ])}
          </Card>
        </Flex>
      </Col>
      <Col xs={24} lg={10}>
        <Flex vertical gap={token.margin}>
          <Card title="Quản lý ca">
            <Form.Item name="shiftView" label="Cấu hình thu ngân và doanh thu trong ca">
              <Select
                options={[
                  { value: 'show', label: 'Cho phép thu ngân thấy doanh thu trong ca' },
                  { value: 'hide', label: 'Ẩn doanh thu trong ca với thu ngân' },
                ]}
              />
            </Form.Item>
            {checks([
              { name: 'countCash', label: 'Đếm tờ tiền khi chốt ca' },
              { name: 'paymentAmounts', label: 'Nhập số tiền của phương thức thanh toán khi chốt ca' },
            ])}
          </Card>
          <Card title="Phạm vi và vận hành">
            <Form.Item label="Thời gian chế biến">
              <Space.Compact block>
                <Form.Item name="prepMinutes" noStyle>
                  <InputNumber min={0} aria-label="Thời gian chế biến" style={{ width: '100%' }} />
                </Form.Item>
                <Space.Addon>Phút</Space.Addon>
              </Space.Compact>
            </Form.Item>
            {checks([
              { name: 'sideDishes', label: 'Món ăn kèm' },
              { name: 'noSideStock', label: 'Không cập nhật số lượng món ăn kèm' },
              { name: 'deleteBillOpenShift', label: 'Cho phép xoá hoá đơn trên CMS khi ca đang mở' },
              { name: 'autoLogout', label: 'Tự động đăng xuất khi chốt ca' },
              { name: 'closeShiftDaily', label: 'Yêu cầu phải đóng ca trong ngày' },
              { name: 'payTablesFirst', label: 'Thanh toán hết các bàn trước khi đóng ca' },
            ])}
          </Card>
        </Flex>
      </Col>
    </Row>
  );

  return (
    <AppShell selected="restaurant-list">
      <PageHeader
        breadcrumb={[{ title: 'Trang chủ' }, { title: 'Danh sách nhà hàng' }, { title: 'Tạo nhà hàng' }]}
        extra={
          <>
            <Button onClick={back}>Trở lại</Button>
            <Button type="primary" disabled={!dirty} loading={saving} onClick={save}>Lưu lại</Button>
          </>
        }
        style={{ borderBottom: 0, paddingBottom: 0 }}
      />
      <Form
        form={form}
        layout="vertical"
        // "<label> không được để trống", the design's wording
        validateMessages={{ required: '${label} không được để trống' }}
        initialValues={{ vatType: 'none', splitBill: 'manual', einvoice: 'fabi', vat: 0, network: 'lan', active: true, voidMode: 'allow', shiftView: 'show', prepMinutes: 23 }}
        onValuesChange={() => {
          setDirty(true);
          setResult(null);
        }}
      >
        <Tabs
          styles={{ body: { padding: token.padding } }}
          tabBarStyle={{ margin: 0, paddingInline: token.padding, background: token.colorBgContainer, borderBottom: `${token.lineWidth}px solid ${token.colorBorderSecondary}` }}
          items={[
            { key: 'details', label: 'Thông tin chi tiết', children: details },
            { key: 'devices', label: 'Thiết bị', children: <Card><Empty description="Chưa có thiết kế cho phần này" /></Card> },
            { key: 'advanced', label: 'Cấu hình nâng cao', children: advanced },
          ]}
          renderTabBar={(props, TabBar) => (
            <>
              <TabBar {...props} />
              {result && (
                <div style={{ padding: `${token.padding}px ${token.padding}px 0` }}>
                  {result === 'success' ? (
                    <Alert type="success" showIcon closable onClose={() => setResult(null)} title="Đã lưu thành công" description="Nếu thay đổi chưa hiện trên thiết bị, hãy tải lại cấu hình trên POS / KDS / PDA." />
                  ) : (
                    <Alert type="error" showIcon closable onClose={() => setResult(null)} title="Lưu thất bại" description="Còn thông tin bắt buộc chưa nhập, xem các ô báo đỏ." />
                  )}
                </div>
              )}
            </>
          )}
        />
      </Form>
    </AppShell>
  );
};

const RestaurantForm: React.FC = () => (
  <App>
    <RestaurantFormInner />
  </App>
);

export default RestaurantForm;
