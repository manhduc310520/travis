// Dashboard ("Trang chủ") of FABi CMS: header with search and account, side menu, filter bar and the
// overview cards. Built only from @fabi/ui components (StatisticCard for the figures, @fabi/ui/charts for the
// charts); numbers and dates follow the FABi convention (9.615.933 ₫, 23,3M, 02/11/2026).
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Drawer,
  Dropdown,
  Flex,
  Grid,
  Input,
  Layout,
  Menu,
  Progress,
  Row,
  Select,
  SearchModal,
  StatisticCard,
  Table,
  Tag,
  Typography,
  theme,
} from '@fabi/ui';
import type { MenuProps, SearchModalGroup, SearchModalItem } from '@fabi/ui';
import { Column, Pie } from '@fabi/ui/charts';
import viVN from '@fabi/ui/locale/vi_VN';
import {
  ArrowRightLine,
  Bell02Line,
  Building02Line,
  Building02Solid,
  CalendarLine,
  CheckCircleBrokenLine,
  CheckCircleBrokenSolid,
  ChevronDownLine,
  ChevronLeftDoubleLine,
  ChevronRightDoubleLine,
  File06Line,
  File06Solid,
  FileSearch02Line,
  FileSearch02Solid,
  Grid01Line,
  Menu01Line,
  Grid01Solid,
  Home03Line,
  Home03Solid,
  LayoutAlt03Line,
  LayoutAlt03Solid,
  LogOut01Line,
  Mail01Line,
  Mail01Solid,
  Monitor03Line,
  Monitor03Solid,
  PieChart04Line,
  PieChart04Solid,
  PrinterLine,
  PrinterSolid,
  SearchSmLine,
  Settings01Line,
  ShoppingCart01Line,
  ShoppingCart01Solid,
  Tag03Line,
  Tag03Solid,
  User01Line,
  Users01Line,
  Users01Solid,
  XLine,
} from '@fabi/ui/fabi-icons';
import { AiIcon, FlagVietnam, LogoWordmark } from './artwork';
import { CustomersIcon, DiscountIcon, EInvoiceIcon, InvoicesIcon } from './statIcons';

const { Header, Sider, Content } = Layout;

/** 9.615.933 ₫ */
const money = (n: number) => `${new Intl.NumberFormat('vi-VN').format(n)} ₫`;
/** 23,3M (millions, vi-VN decimal comma) */
const millions = (n: number) => `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(n / 1e6)}M`;
/** Search shortcut hint: ⌘ K on a Mac, Ctrl K elsewhere */
const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);
const shortcut = isMac ? '⌘ K' : 'Ctrl K';

// ---- demo data (replace with the app's) ----
// Icons as in the design's menu: line when idle, the solid twin when selected
const NAV: { key: string; label: string; icon: React.ReactNode; activeIcon: React.ReactNode }[] = [
  { key: 'home', label: 'Trang chủ', icon: <Home03Line />, activeIcon: <Home03Solid /> },
  { key: 'restaurants', label: 'Nhà hàng', icon: <Building02Line />, activeIcon: <Building02Solid /> },
  { key: 'menu', label: 'Thực đơn', icon: <LayoutAlt03Line />, activeIcon: <LayoutAlt03Solid /> },
  { key: 'promotions', label: 'Chương trình', icon: <Tag03Line />, activeIcon: <Tag03Solid /> },
  { key: 'devices', label: 'Thiết bị', icon: <PrinterLine />, activeIcon: <PrinterSolid /> },
  { key: 'staff', label: 'Nhân viên', icon: <Users01Line />, activeIcon: <Users01Solid /> },
  { key: 'reports', label: 'Báo cáo', icon: <PieChart04Line />, activeIcon: <PieChart04Solid /> },
  { key: 'apps', label: 'Ứng dụng', icon: <Grid01Line />, activeIcon: <Grid01Solid /> },
  { key: 'marketplace', label: 'Marketplace', icon: <ShoppingCart01Line />, activeIcon: <ShoppingCart01Solid /> },
  { key: 'accounting', label: 'Kế toán vo', icon: <FileSearch02Line />, activeIcon: <FileSearch02Solid /> },
  { key: 'timesheet', label: 'Chấm công, lương', icon: <CheckCircleBrokenLine />, activeIcon: <CheckCircleBrokenSolid /> },
  { key: 'channels', label: 'Nhận đơn đa kênh', icon: <Monitor03Line />, activeIcon: <Monitor03Solid /> },
  { key: 'support', label: 'Góp ý hỗ trợ', icon: <Mail01Line />, activeIcon: <Mail01Solid /> },
  { key: 'einvoice', label: 'Hoá đơn điện tử', icon: <File06Line />, activeIcon: <File06Solid /> },
];

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
  { label: 'Tổng thực thu', value: money(3582992775) },
];
const SHOPEE_ROWS = [
  { key: 'order', category: 'Tổng giá trị đơn hàng', amount: 151469848 },
  { key: 'commission', category: 'Tổng hoa hồng chiết khấu', amount: 22720477 },
  { key: 'promotion', category: 'Tổng khuyến mại nhà hàng', amount: 7573492 },
  { key: 'partner', category: 'Tổng giảm giá đối tác', amount: 3029397 },
];
const PROFIT_AND_LOSS = [
  { label: 'Doanh thu', value: money(3446961) },
  { label: 'Tổng chi phí', value: money(373642) },
  { label: 'Chi phí nguyên vật liệu', value: money(373642) },
  { label: 'Chi phí trong tháng', value: money(0) },
  { label: 'Chi phí phân bổ hàng tháng', value: money(0) },
  { label: 'Lợi nhuận', value: money(3073319) },
];

// what the header search finds: the app's features, grouped by where they live (demo data)
const SEARCH_GROUPS: SearchModalGroup[] = [
  { key: 'restaurants', path: ['Nhà hàng', 'Danh sách nhà hàng'], items: [
    { key: 'restaurant-add', label: 'Thêm nhà hàng' },
    { key: 'restaurant-info', label: 'Thông tin nhà hàng' },
    { key: 'restaurant-tables', label: 'Khu vực và bàn', keywords: 'sơ đồ bàn' },
  ] },
  { key: 'products', path: ['Thực đơn', 'Sản phẩm'], items: [
    { key: 'product-list', label: 'Danh sách sản phẩm', keywords: 'món ăn, đồ uống' },
    { key: 'product-add', label: 'Thêm sản phẩm', keywords: 'món mới' },
    { key: 'product-groups', label: 'Nhóm sản phẩm', keywords: 'danh mục' },
    { key: 'product-combos', label: 'Combo' },
  ] },
  { key: 'promotions', path: ['Chương trình', 'Khuyến mại'], items: [
    { key: 'promotion-add', label: 'Tạo chương trình khuyến mại' },
    { key: 'promotion-codes', label: 'Mã giảm giá', keywords: 'voucher, coupon' },
  ] },
  { key: 'reports', path: ['Báo cáo', 'Doanh thu'], items: [
    { key: 'report-daily', label: 'Doanh thu theo ngày' },
    { key: 'report-products', label: 'Doanh thu theo sản phẩm' },
    { key: 'report-profit', label: 'Báo cáo lãi lỗ tháng' },
  ] },
  { key: 'staff', path: ['Nhân viên'], items: [
    { key: 'staff-list', label: 'Danh sách nhân viên' },
    { key: 'staff-roles', label: 'Phân quyền' },
    { key: 'staff-timesheet', label: 'Chấm công, lương' },
  ] },
  { key: 'einvoice', path: ['Hoá đơn điện tử'], items: [
    { key: 'einvoice-list', label: 'Danh sách hoá đơn' },
    { key: 'einvoice-settings', label: 'Cấu hình hoá đơn điện tử' },
  ] },
  { key: 'account', path: ['Tài khoản'], items: [
    { key: 'account-settings', label: 'Tài khoản và cài đặt' },
    { key: 'account-profile', label: 'Thông tin cá nhân' },
    { key: 'account-payment', label: 'Phương thức thanh toán' },
    { key: 'account-security', label: 'Bảo mật tài khoản' },
    { key: 'account-transactions', label: 'Lịch sử giao dịch' },
    { key: 'account-support', label: 'Hỗ trợ khách hàng' },
  ] },
];
const SEARCH_ITEMS = SEARCH_GROUPS.flatMap((g) => g.items);
const SEARCH_HISTORY: SearchModalItem[] = ['account-settings', 'account-profile', 'account-payment', 'account-support', 'report-daily', 'product-list']
  .flatMap((key) => SEARCH_ITEMS.filter((item) => item.key === key));

// phones: the AI assistant and the language sit at the top of the account menu instead of the header
const COMPACT_ITEMS: NonNullable<MenuProps['items']> = [
  { key: 'ai', icon: <AiIcon />, label: 'Trợ lý AI' },
  { key: 'language', icon: <FlagVietnam />, label: 'Ngôn ngữ: Tiếng Việt' },
  { type: 'divider' },
];

const accountItems: NonNullable<MenuProps['items']> = [
  { key: 'profile', icon: <User01Line />, label: 'Tài khoản' },
  { key: 'settings', icon: <Settings01Line />, label: 'Cài đặt' },
  { type: 'divider' },
  { key: 'logout', icon: <LogOut01Line />, label: 'Đăng xuất' },
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

/** Ranked names and amounts ("Top 5 mặt hàng bán chạy"). */
const RankList: React.FC<{ items: { name: string; value: number }[] }> = ({ items }) => (
  <Flex vertical gap="middle" component="ol" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
    {items.map((item, i) => (
      <Flex key={item.name} component="li" align="center" gap="middle">
        <Rank n={i + 1} />
        <Typography.Text ellipsis style={{ flex: 1 }}>{item.name}</Typography.Text>
        <Typography.Text>{money(item.value)}</Typography.Text>
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

/** Header actions on the brand gradient: the dark theme (FABi's darkAlgorithm keeps the brand). `onSearch`: the
 *  search button that replaces the search field on phones; `compact`: no account name. */
const HeaderActions: React.FC<{ compact?: boolean; onSearch?: () => void }> = ({ compact, onSearch }) => (
  <Flex align="center" gap="small" justify="flex-end" style={{ flex: compact ? 'none' : 1 }}>
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      {onSearch && <Button type="text" shape="circle" icon={<SearchSmLine />} aria-label="Tìm kiếm" aria-haspopup="dialog" onClick={onSearch} />}
      {!compact && <Button type="text" shape="circle" icon={<AiIcon />} aria-label="Trợ lý AI" />}
      {!compact && <Button type="text" shape="circle" icon={<FlagVietnam />} aria-label="Ngôn ngữ: Tiếng Việt" />}
      <Badge count={3} size="small">
        <Button type="text" shape="circle" icon={<Bell02Line />} aria-label="Thông báo, 3 mới" />
      </Badge>
    </ConfigProvider>
    <Dropdown menu={{ items: compact ? [...COMPACT_ITEMS, ...accountItems] : accountItems }} placement="bottomRight" trigger={['click']}>
      <span>
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          <Button type="text" aria-label="Tài khoản: Chanh dev">
            <Flex align="center" gap="small">
              <Avatar size="small" icon={<User01Line />} />
              {!compact && <Typography.Text>Chanh dev</Typography.Text>}
              <ChevronDownLine />
            </Flex>
          </Button>
        </ConfigProvider>
      </span>
    </Dropdown>
  </Flex>
);

const Dashboard: React.FC = () => {
  const { token } = theme.useToken();
  const [selected, setSelected] = useState('home');
  // the sider starts collapsed below lg (992), like its breakpoint does, so the first layout does not jump
  const [collapsed, setCollapsed] = useState(() => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${token.screenLG - 0.02}px)`).matches);
  // the side menu's scrollbar shows only while the pointer or the focus is in it
  const [menuActive, setMenuActive] = useState(false);
  // antd's Layout header height (controlHeight × 2): the sider sticks right under the sticky header
  const headerHeight = token.controlHeight * 2;
  const [figure, setFigure] = useState<'gross' | 'net'>('gross');
  // phones (< md 768): no sider, the menu opens in a Drawer; the search field becomes a button
  const screens = Grid.useBreakpoint();
  // useBreakpoint is empty on the first render: read the media query once so the first layout is already right
  // (a desktop first pass on a phone leaves the charts measuring a zero-width card)
  const [phoneAtMount] = useState(() => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${token.screenMD - 0.02}px)`).matches);
  const phone = screens.md === undefined ? phoneAtMount : !screens.md;
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => {
    if (!phone) setNavOpen(false);
  }, [phone]);
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>([dayjs('2026-11-02'), dayjs('2026-11-02')]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [history, setHistory] = useState<SearchModalItem[]>(SEARCH_HISTORY);
  // ⌘ K / Ctrl K opens the search anywhere on the page
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key?.toLowerCase() === 'k') {
        e.preventDefault();
        // capture phase + stopPropagation: the host page (e.g. Storybook's own search) does not also take it
        e.stopPropagation();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);
  const dark = token.colorBgContainer !== '#ffffff';
  const paymentColors = [token.colorPrimary, token['cyan-6'], token['orange-6'], token['purple-4']];
  const paymentTotal = PAYMENTS.reduce((sum, p) => sum + p.value, 0);

  const menuItems: MenuProps['items'] = NAV.map((item) => ({
    key: item.key,
    label: item.label,
    icon: selected === item.key ? item.activeIcon : item.icon,
  }));
  const bottomItems: MenuProps['items'] = [
    { key: 'collapse', label: collapsed ? 'Mở' : 'Thu gọn', icon: collapsed ? <ChevronRightDoubleLine /> : <ChevronLeftDoubleLine /> },
  ];

  return (
    // the app's UI is Vietnamese (pickers, empty states, pagination…): set it once at the app root
    <ConfigProvider locale={viVN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: phone ? token.marginXS : token.margin,
            paddingInline: phone ? token.padding : token.paddingLG,
          }}
        >
          {phone && (
            <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
              <Button type="text" shape="circle" icon={<Menu01Line />} aria-label="Mở menu" aria-expanded={navOpen} onClick={() => setNavOpen(true)} />
            </ConfigProvider>
          )}
          <Flex align="center" style={{ flex: '1 0 auto', color: token.colorTextLightSolid }}>
            <LogoWordmark />
          </Flex>
          {!phone && (
            // the wrapper takes clicks on the icon, the hint and the padding too
            <div style={{ maxWidth: 480, flex: 2, minWidth: 0 }} onClick={() => setSearchOpen(true)}>
              <Input
                readOnly
                aria-label="Tìm kiếm"
                aria-haspopup="dialog"
                placeholder="Tìm kiếm"
                prefix={<SearchSmLine />}
                suffix={<Typography.Text type="secondary" keyboard>{shortcut}</Typography.Text>}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSearchOpen(true);
                  }
                }}
                style={{ cursor: 'pointer' }}
              />
            </div>
          )}
          <HeaderActions compact={phone} onSearch={phone ? () => setSearchOpen(true) : undefined} />
        </Header>
        <SearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          groups={SEARCH_GROUPS}
          history={history}
          onClearHistory={() => setHistory([])}
          onSelect={(item) => setHistory((h) => [item, ...h.filter((x) => x.key !== item.key)].slice(0, 9))}
        />
        <Layout>
          {phone ? (
            <Drawer
              title="Menu"
              placement="left"
              open={navOpen}
              onClose={() => setNavOpen(false)}
              size={256}
              styles={{ body: { padding: 0 } }}
            >
              <Menu
                mode="inline"
                selectedKeys={[selected]}
                onClick={(e) => {
                  setSelected(e.key);
                  setNavOpen(false);
                }}
                items={menuItems}
                style={{ borderInlineEnd: 0, paddingBlock: token.paddingXS }}
              />
            </Drawer>
          ) : (
            <Sider
              width={256}
              collapsedWidth={80}
              collapsed={collapsed}
              breakpoint="lg"
              onBreakpoint={setCollapsed}
              // sticky under the header, one screen tall: the menu scrolls inside, "Thu gọn" stays at the bottom
              style={{ position: 'sticky', top: headerHeight, height: `calc(100vh - ${headerHeight}px)`, background: token.colorBgContainer }}
            >
              <Flex vertical style={{ height: '100%' }}>
                <Menu
                  mode="inline"
                  selectedKeys={[selected]}
                  onClick={(e) => setSelected(e.key)}
                  items={menuItems}
                  onMouseEnter={() => setMenuActive(true)}
                  onMouseLeave={() => setMenuActive(false)}
                  onFocus={() => setMenuActive(true)}
                  onBlur={() => setMenuActive(false)}
                  style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${menuActive ? token.colorFill : 'transparent'} transparent`,
                    borderInlineEnd: 0,
                    paddingBlock: token.paddingXS,
                  }}
                />
                <Menu
                  mode="inline"
                  selectable={false}
                  items={bottomItems}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ borderInlineEnd: 0, borderTop: `1px solid ${token.colorBorderSecondary}`, paddingBlock: token.paddingXS }}
                />
              </Flex>
            </Sider>
          )}
          <Layout>
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
                        { title: 'Số tiền', dataIndex: 'amount', render: (v: number) => money(v) },
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
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Dashboard;
