// Dashboard ("Trang chủ") of FABi CMS, inside the AppShell (header, menu, search): filter bar and the
// overview cards. Built only from @fabi/ui components (StatisticCard for the figures, @fabi/ui/charts for the
// charts); numbers and dates follow the FABi convention (9.615.933 ₫, 23,3M, 02/11/2026).
import React, { useState } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Flex,
  Layout,
  Progress,
  Row,
  Select,
  StatisticCard,
  Table,
  Tag,
  Typography,
  theme,
  formatMoney,
} from '@fabi/ui';
import { Column, Pie } from '@fabi/ui/charts';
import {
  ArrowRightLine,
  CalendarLine,
  ChevronDownLine,
  XLine,
} from '@fabi/ui/fabi-icons';
import AppShell, { useIsPhone } from '../shell/AppShell';
import { CustomersIcon, DiscountIcon, EInvoiceIcon, InvoicesIcon } from './statIcons';

const { Content } = Layout;

/** 23,3M (millions, vi-VN decimal comma) */
const millions = (n: number) => `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(n / 1e6)}M`;

// ---- demo data (replace with the app's) ----

const RESTAURANTS = ['Ga ran 365', 'ga ran 345', 'Gà rán 24h', 'Trà sữa Phố', 'Bún chả Hà Nội', 'Cơm tấm Sài Gòn', 'Phở Thìn', 'Lẩu Nấm', 'Bánh mì 37', 'Cafe Sáng', 'Pizza Nhà', 'Sushi Mini', 'Kem Tràng Tiền', 'Bò Né 3 Ngon', 'Chè Bốn Mùa'].map(
  (name) => ({ value: name, label: name }),
);

const REVENUE_BY_MONTH = [
  { month: '10/2023', value: 680 },
  { month: '01/2024', value: 830 },
  { month: '03/2024', value: 830 },
  { month: '04/2024', value: 830 },
  { month: '05/2024', value: 640 },
  { month: '06/2024', value: 820 },
  { month: '07/2024', value: 830 },
  { month: '08/2024', value: 750 },
];

const TOP_ITEMS = [
  { name: 'Trà Sữa Matcha (M)', value: 2700000 },
  { name: 'Trà Sữa Xanh (M)', value: 1200000 },
  { name: 'Trà Sữa Bạc Hà (M)', value: 1300000 },
  { name: 'Trà Sữa Caramel (M)', value: 400000 },
  { name: 'Trà Sữa Dâu (M)', value: 100000 },
  { name: 'Sản phẩm khác', value: 23700000 },
];
const TOP_SOURCES = [
  { name: 'Mang về', value: 23300000 },
  { name: 'Tại chỗ', value: 50000000 },
  { name: 'Shopee', value: 23300000 },
  { name: 'Grab', value: 50000000 },
  { name: 'Be', value: 23300000 },
];
const TOP_PROMOTIONS = [
  { name: 'Khuyến mãi tháng 1', value: 23300000 },
  { name: 'Khuyến mãi tháng 2', value: 50000000 },
  { name: 'Khuyến mãi tháng 3', value: 23300000 },
  { name: 'Khuyến mãi tháng 4', value: 50000000 },
  { name: 'Khuyến mãi tháng 5', value: 23300000 },
];
const PAYMENTS = [
  { type: 'Tiền mặt', value: 6075000 },
  { type: 'Chuyển khoản', value: 6075000 },
  { type: 'MoMo', value: 6075000 },
  { type: 'ZaloPay', value: 6075000 },
];
const SHOPEE_TOTALS = [
  { label: 'Tổng đơn', value: '51' },
  { label: 'Tổng thực thu', value: formatMoney(3582992775) },
];
const SHOPEE_ROWS = [
  { key: 'order', category: 'Tổng giá trị đơn hàng', amount: 151469848 },
  { key: 'commission', category: 'Tổng hoa hồng chiết khấu', amount: 22720477 },
  { key: 'promotion', category: 'Tổng khuyến mại nhà hàng', amount: 7573492 },
  { key: 'partner', category: 'Tổng giảm giá đối tác', amount: 3029397 },
];
const PROFIT_AND_LOSS = [
  { label: 'Doanh thu', value: formatMoney(3446961) },
  { label: 'Tổng chi phí', value: formatMoney(373642) },
  { label: 'Chi phí nguyên vật liệu', value: formatMoney(373642) },
  { label: 'Chi phí trong tháng', value: formatMoney(0) },
  { label: 'Chi phí phân bổ hàng tháng', value: formatMoney(0) },
  { label: 'Lợi nhuận', value: formatMoney(3073319) },
];

// ---- page parts (each used by several cards) ----

const DetailLink = () => <Button type="link">Chi tiết</Button>;

/** Rank badge of a top list: 1 brand colour, 2 orange, 3 grey, then the plain number. */
const Rank: React.FC<{ n: number }> = ({ n }) => {
  const { token } = theme.useToken();
  if (n > 3) return <Typography.Text style={{ width: token.controlHeightSM, textAlign: 'center' }}>{n}</Typography.Text>;
  const bg = n === 1 ? token.colorPrimary : n === 2 ? token['orange-8'] : token.colorFillSecondary;
  const fg = n === 3 ? token.colorText : token.colorTextLightSolid;
  return <Avatar size="small" style={{ background: bg, color: fg, flex: 'none' }}>{n}</Avatar>;
};

/** Ranked names and amounts ("Top 5 mặt hàng bán chạy"); rows 24px apart (user 2026-10-17: more air between rows). */
const RankList: React.FC<{ items: { name: string; value: number }[] }> = ({ items }) => (
  <Flex vertical gap="large" component="ol" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
    {items.map((item, i) => (
      <Flex key={item.name} component="li" align="center" gap="middle">
        <Rank n={i + 1} />
        <Typography.Text ellipsis style={{ flex: 1 }}>{item.name}</Typography.Text>
        <Typography.Text>{formatMoney(item.value)}</Typography.Text>
      </Flex>
    ))}
  </Flex>
);

/** Names with a bar against the largest value ("Top 5 nguồn đơn", "Top 5 chương trình khuyến mại"). */
const BarList: React.FC<{ items: { name: string; value: number }[] }> = ({ items }) => {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <Flex vertical gap="middle" component="ol" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
      {items.map((item) => (
        <li key={item.name}>
          <Typography.Text>{item.name}</Typography.Text>
          {/* status normal: a full bar is the largest value, not a "done" state */}
          <Progress percent={(item.value / max) * 100} status="normal" format={() => millions(item.value)} aria-label={`${item.name}: ${millions(item.value)}`} />
        </li>
      ))}
    </Flex>
  );
};

/** Rows of the label / value lists, as designed: 10px apart (off the 4px grid, kept to match the design) */
const ROW_GAP = 10;

/** Label and value rows ("Đơn từ kênh", "Báo cáo lãi lỗ tháng"), as designed: 38px rows (22px text, 8px
 *  padding), values at the end; `striped` fills every second row (colorBgContainerDisabled, radius 6). */
const ValueRows: React.FC<{ rows: { label: string; value: string }[]; striped?: boolean }> = ({ rows, striped }) => {
  const { token } = theme.useToken();
  return (
    <Flex vertical gap={ROW_GAP} component="dl" style={{ margin: 0 }}>
      {rows.map((row, i) => (
        <Flex
          key={row.label}
          justify="space-between"
          align="center"
          gap="middle"
          style={{
            padding: token.paddingXS,
            borderRadius: token.borderRadius,
            background: striped && i % 2 === 1 ? token.colorBgContainerDisabled : undefined,
          }}
        >
          <dt><Typography.Text>{row.label}</Typography.Text></dt>
          <dd style={{ margin: 0, textAlign: 'end' }}><Typography.Text>{row.value}</Typography.Text></dd>
        </Flex>
      ))}
    </Flex>
  );
};

/** Card with the "Chi tiết" link, full height in its row */
const DashCard: React.FC<React.PropsWithChildren<{ title: string }>> = ({ title, children }) => (
  <Card title={title} extra={<DetailLink />} style={{ height: '100%' }}>
    {children}
  </Card>
);

const Dashboard: React.FC = () => {
  const { token } = theme.useToken();
  const phone = useIsPhone();
  const [figure, setFigure] = useState<'gross' | 'net'>('gross');
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>([dayjs('2026-11-02'), dayjs('2026-11-02')]);
  const dark = token.colorBgContainer !== '#ffffff';
  const paymentColors = [token.colorPrimary, token['cyan-6'], token['orange-6'], token['purple-4']];
  const paymentTotal = PAYMENTS.reduce((sum, p) => sum + p.value, 0);

  return (
    <AppShell selected="home">
            <Flex
              gap="middle"
              wrap
              style={{ padding: `${token.paddingSM}px ${token.padding}px`, background: token.colorBgContainer, borderBottom: `1px solid ${token.colorBorderSecondary}` }}
            >
              {phone ? (
                // the range popup is 576px wide: on phones two single pickers (288px popups) share the range
                <Flex gap="small" style={{ width: '100%' }}>
                  <DatePicker
                    aria-label="Từ ngày"
                    placeholder="Từ ngày"
                    format="DD/MM/YYYY"
                    suffixIcon={<CalendarLine />}
                    value={range[0]}
                    onChange={(d) => setRange([d, range[1]])}
                    disabledDate={(d) => !!range[1] && d.isAfter(range[1], 'day')}
                    style={{ flex: 1, minWidth: 0 }}
                  />
                  <DatePicker
                    aria-label="Đến ngày"
                    placeholder="Đến ngày"
                    format="DD/MM/YYYY"
                    suffixIcon={<CalendarLine />}
                    value={range[1]}
                    onChange={(d) => setRange([range[0], d])}
                    disabledDate={(d) => !!range[0] && d.isBefore(range[0], 'day')}
                    style={{ flex: 1, minWidth: 0 }}
                  />
                </Flex>
              ) : (
                <DatePicker.RangePicker
                  aria-label="Khoảng ngày"
                  format="DD/MM/YYYY"
                  suffixIcon={<CalendarLine />}
                  separator={<ArrowRightLine />}
                  value={range}
                  onChange={(v) => setRange(v ?? [null, null])}
                />
              )}
              <Select
                aria-label="Nhà hàng"
                mode="multiple"
                maxTagCount={2}
                options={RESTAURANTS}
                defaultValue={RESTAURANTS.map((r) => r.value)}
                suffixIcon={<ChevronDownLine />}
                removeIcon={<XLine />}
                style={phone ? { width: '100%' } : { minWidth: 320 }}
              />
            </Flex>
            <Content style={{ padding: token.padding }}>
              <Row gutter={[token.margin, token.margin]}>
                <Col span={24}>
                  <StatisticCard
                    type="primary"
                    title={
                      <Dropdown
                        trigger={['click']}
                        menu={{
                          items: [
                            { key: 'gross', label: 'Doanh thu (Gross)' },
                            { key: 'net', label: 'Doanh thu (Net)' },
                          ],
                          selectable: true,
                          selectedKeys: [figure],
                          onClick: (e) => setFigure(e.key as 'gross' | 'net'),
                        }}
                      >
                        <Flex
                          component="span"
                          role="button"
                          tabIndex={0}
                          aria-haspopup="menu"
                          // a span does not turn Enter / Space into a click like a button does
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.currentTarget.click();
                            }
                          }}
                          align="center"
                          gap="small"
                          style={{ display: 'inline-flex', cursor: 'pointer' }}
                        >
                          {figure === 'gross' ? 'Doanh thu (Gross)' : 'Doanh thu (Net)'}
                          <ChevronDownLine />
                        </Flex>
                      </Dropdown>
                    }
                    value={figure === 'gross' ? 9615933 : 8115933}
                    suffix="₫"
                    trend={8}
                    comparison="so với Từ ngày 01/05 đến ngày 31/05"
                  />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                  <StatisticCard title="Giảm giá và chi phí" value={1500000} suffix="₫" description="Trung bình 160.266 ₫ / hoá đơn" icon={<DiscountIcon />} color="blue" />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                  <StatisticCard title="Tổng hoá đơn" value={60} description="Trung bình 160.266 ₫ / hoá đơn" icon={<InvoicesIcon />} color="orange" />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                  <StatisticCard title="Số khách" value={23} description="Trung bình 20.000 ₫ / khách" icon={<CustomersIcon />} color="green" />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                  <StatisticCard title="Số hoá đơn điện tử" value={900} icon={<EInvoiceIcon />} color="magenta" extra={<Flex gap={token.marginXXS} wrap><Tag>Chanhdev</Tag><Tag>+5</Tag></Flex>} />
                </Col>

                <Col xs={24} xl={16}>
                  <DashCard title="Doanh thu theo ngày">
                    <Typography.Text type="secondary">Doanh thu (₫)</Typography.Text>
                    <div role="img" aria-label="Biểu đồ cột doanh thu theo tháng, từ 10/2023 đến 08/2024">
                      <Column
                        data={REVENUE_BY_MONTH}
                        xField="month"
                        yField="value"
                        height={320}
                        theme={dark ? 'classicDark' : 'classic'}
                        style={{ fill: token.colorPrimary }}
                        // narrow cards (tablet, phone): month labels that do not fit are hidden instead of overlapping
                        axis={{ x: { labelAutoHide: true }, y: { labelFormatter: (v: number) => new Intl.NumberFormat('vi-VN').format(v) } }}
                      />
                    </div>
                  </DashCard>
                </Col>
                <Col xs={24} xl={8}>
                  <DashCard title="Top 5 mặt hàng bán chạy">
                    <Select
                      aria-label="Chỉ số xếp hạng"
                      variant="borderless"
                      defaultValue="gross"
                      suffixIcon={<ChevronDownLine style={{ fontSize: token.fontSize }} />}
                      options={[
                        { value: 'gross', label: 'Doanh thu (gross)' },
                        { value: 'quantity', label: 'Số lượng bán' },
                      ]}
                      style={{ marginInlineStart: -token.paddingSM, marginBottom: token.marginSM }}
                    />
                    <RankList items={TOP_ITEMS} />
                  </DashCard>
                </Col>

                <Col xs={24} lg={8}>
                  <DashCard title="Top 5 nguồn đơn">
                    <BarList items={TOP_SOURCES} />
                  </DashCard>
                </Col>
                <Col xs={24} lg={8}>
                  <DashCard title="Top 5 chương trình khuyến mại">
                    <BarList items={TOP_PROMOTIONS} />
                  </DashCard>
                </Col>
                <Col xs={24} lg={8}>
                  <DashCard title="Top 5 phương thức thanh toán">
                    <Flex align="center" gap="middle" wrap>
                      <div role="img" aria-label={`Biểu đồ tròn phương thức thanh toán, tổng ${millions(paymentTotal)}, mỗi phương thức 25%`} style={{ flex: '1 1 160px' }}>
                        <Pie
                          data={PAYMENTS}
                          angleField="value"
                          colorField="type"
                          innerRadius={0.62}
                          height={200}
                          theme={dark ? 'classicDark' : 'classic'}
                          legend={false}
                          scale={{ color: { range: paymentColors } }}
                          label={{ text: (d: { value: number }) => `${Math.round((d.value / paymentTotal) * 100)}%`, style: { fill: token.colorTextLightSolid, fontWeight: token.fontWeightStrong } }}
                          annotations={[
                            { type: 'text', style: { text: millions(paymentTotal), x: '50%', y: '50%', textAlign: 'center', textBaseline: 'middle', fontSize: token.fontSizeLG, fontWeight: token.fontWeightStrong, fill: token.colorText } },
                          ]}
                        />
                      </div>
                      <Flex vertical gap="small" component="ul" style={{ margin: 0, padding: 0, listStyle: 'none', flex: '1 1 140px' }}>
                        {PAYMENTS.map((p, i) => (
                          <Flex key={p.type} component="li" justify="space-between" gap="small">
                            <Badge color={paymentColors[i]} text={`${p.type}:`} />
                            <Typography.Text>{millions(p.value)}</Typography.Text>
                          </Flex>
                        ))}
                      </Flex>
                    </Flex>
                  </DashCard>
                </Col>

                <Col xs={24} xl={12}>
                  <DashCard title="Đơn từ kênh: Shopee">
                    <ValueRows rows={SHOPEE_TOTALS} />
                    <Table
                      bordered
                      pagination={false}
                      dataSource={SHOPEE_ROWS}
                      columns={[
                        { title: 'Danh mục', dataIndex: 'category' },
                        { title: 'Số tiền', dataIndex: 'amount', render: (v: number) => formatMoney(v) },
                      ]}
                      style={{ marginTop: ROW_GAP }}
                    />
                  </DashCard>
                </Col>
                <Col xs={24} xl={12}>
                  <DashCard title="Báo cáo lãi lỗ tháng">
                    <ValueRows rows={PROFIT_AND_LOSS} striped />
                  </DashCard>
                </Col>
              </Row>
            </Content>
    </AppShell>
  );
};

export default Dashboard;
