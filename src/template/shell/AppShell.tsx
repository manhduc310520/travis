// AppShell: the FABi CMS frame every template page sits in (split out of the Dashboard, user 2026-10-13):
// sticky brand header (logo, search → SearchModal, ⌘ K / Ctrl K, AI, language, notifications, account), sticky
// side menu (line icons, the solid twin when selected; collapses to 80px below lg; a Drawer on phones < md) and
// the Vietnamese locale. Pages pass the selected menu key and their content.
// Dashboard ("Trang chủ") of FABi CMS: header with search and account, side menu, filter bar and the
// overview cards. Built only from @fabi/ui components (StatisticCard for the figures, @fabi/ui/charts for the
// charts); numbers and dates follow the FABi convention (9.615.933 ₫, 23,3M, 02/11/2026).
import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'dayjs/locale/vi';
import {
  Avatar,
  Badge,
  Button,
  ConfigProvider,
  Drawer,
  Dropdown,
  Flex,
  Grid,
  Input,
  Layout,
  Menu,
  SearchModal,
  Typography,
  theme,
} from '@fabi/ui';
import type { MenuProps, SearchModalGroup, SearchModalItem } from '@fabi/ui';
import viVN from '@fabi/ui/locale/vi_VN';
import {
  Bell02Line,
  Building02Line,
  Building02Solid,
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
} from '@fabi/ui/fabi-icons';
import { AiIcon, FlagVietnam, LogoWordmark } from './artwork';

const { Header, Sider } = Layout;

/** Search shortcut hint: ⌘ K on a Mac, Ctrl K elsewhere */
const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);
const shortcut = isMac ? '⌘ K' : 'Ctrl K';

// Icons as in the design's menu: line when idle, the solid twin when selected
// children: a submenu (no icons, indented); the parent shows its solid icon while one of them is selected
const NAV: { key: string; label: string; icon: React.ReactNode; activeIcon: React.ReactNode; children?: { key: string; label: string }[] }[] = [
  { key: 'home', label: 'Trang chủ', icon: <Home03Line />, activeIcon: <Home03Solid /> },
  {
    key: 'restaurants',
    label: 'Nhà hàng',
    icon: <Building02Line />,
    activeIcon: <Building02Solid />,
    children: [
      { key: 'restaurant-list', label: 'Danh sách nhà hàng' },
      { key: 'payment-methods', label: 'Phương thức thanh toán' },
      { key: 'order-sources', label: 'Nguồn đơn hàng' },
      { key: 'printers', label: 'Vị trí máy in' },
      { key: 'areas', label: 'Khu vực' },
      { key: 'tables', label: 'Quản lý bàn' },
      { key: 'floor-plan', label: 'Sơ đồ bàn' },
      { key: 'receipt-templates', label: 'Mẫu hoá đơn' },
      { key: 'momo', label: 'Merchant Momo' },
      { key: 'pos-links', label: 'Liên kết điểm bán hàng' },
    ],
  },
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

/** Phones (< md 768), right on the first render (useBreakpoint is empty then): pages switch layouts with it */
export function useIsPhone() {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const [phoneAtMount] = useState(() => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${token.screenMD - 0.02}px)`).matches);
  return screens.md === undefined ? phoneAtMount : !screens.md;
}

export interface AppShellProps {
  /** Menu key of the current page (e.g. 'home', 'menu', 'restaurants') */
  selected?: string;
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ selected: selectedKey = 'home', children }) => {
  const { token } = theme.useToken();
  const [selected, setSelected] = useState(selectedKey);
  // the sider starts collapsed below lg (992), like its breakpoint does, so the first layout does not jump
  const [collapsed, setCollapsed] = useState(() => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${token.screenLG - 0.02}px)`).matches);
  // the side menu's scrollbar shows only while the pointer or the focus is in it
  const [menuActive, setMenuActive] = useState(false);
  // antd's Layout header height (controlHeight × 2): the sider sticks right under the sticky header
  const headerHeight = token.controlHeight * 2;
  // phones (< md 768): no sider, the menu opens in a Drawer; the search field becomes a button
  const phone = useIsPhone();
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => {
    if (!phone) setNavOpen(false);
  }, [phone]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const getSearchAnchor = useCallback(() => searchRef.current, []);
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

  const menuItems: MenuProps['items'] = NAV.map((item) => {
    const active = selected === item.key || !!item.children?.some((c) => c.key === selected);
    return { key: item.key, label: item.label, icon: active ? item.activeIcon : item.icon, children: item.children };
  });
  // the submenu of the current page starts open
  const parentOfSelected = NAV.find((item) => item.children?.some((c) => c.key === selected))?.key;
  const [openKeys, setOpenKeys] = useState<string[]>(parentOfSelected ? [parentOfSelected] : []);
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
            <div ref={searchRef} style={{ maxWidth: 480, flex: 2, minWidth: 0 }} onClick={() => setSearchOpen(true)}>
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
          // opens over the header search (phones: no field there, so centred)
          getAnchor={getSearchAnchor}
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
                defaultOpenKeys={parentOfSelected ? [parentOfSelected] : []}
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
                  {...(collapsed ? {} : { openKeys, onOpenChange: setOpenKeys })}
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
          <Layout>{children}</Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AppShell;
