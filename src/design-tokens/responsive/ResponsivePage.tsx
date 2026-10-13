// Design Tokens / Responsive. Written by hand, not by scripts/convert-pages.mjs (that script writes only the pages in
// its PAGES list and never deletes other folders). The breakpoint values, the Viewport toolbar sizes and the spacing
// are read live from the theme tokens and .storybook/viewports.ts, so the page follows them. The app-shell rules are
// those of src/template/dashboard/Dashboard.tsx and packages/fabi-ui/src/SearchModal.tsx: update this page with them.
import { useEffect, useState } from 'react'
import { Source, Unstyled as DocUnstyled } from '@storybook/addon-docs/blocks'
import { Descriptions, Grid, Typography, theme } from '@fabi/ui'
import { useDocsLocale } from '../../../.storybook/locale'
import { PAGE_TITLES_VI } from '../../../.storybook/labels'
import { VIEWPORTS } from '../../../.storybook/viewports'

type Token = ReturnType<typeof theme.useToken>['token']

const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'] as const
type Breakpoint = (typeof BREAKPOINTS)[number]
type Shell = 'phone' | 'tablet' | 'desktop'

// Props of the app shell in Dashboard.tsx (component props, not tokens)
const SIDER_WIDTH = 256
const SIDER_COLLAPSED = 80
const DRAWER_WIDTH = 256
const SEARCH_MAX = 480
const SELECT_MIN = 320
// SearchModal defaults (packages/fabi-ui/src/SearchModal.tsx)
const SEARCH_MODAL_WIDTH = 650
const SEARCH_MODAL_HEIGHT = 450

type Row = { bp: Breakpoint; min: number; max?: number; query: string; tokens: [string, number][] }

/** Each breakpoint as Grid and useBreakpoint() build it from the theme: xs is a max-width query, the others min-width. */
function breakpointRows(t: Token): Row[] {
  const row = (bp: Breakpoint, min: number, max: number | undefined, tokens: [string, number][]): Row => ({
    bp, min, max, tokens, query: bp === 'xs' ? `(max-width: ${max}px)` : `(min-width: ${min}px)`,
  })
  return [
    row('xs', 0, t.screenXSMax, [['screenXS', t.screenXS], ['screenXSMin', t.screenXSMin], ['screenXSMax', t.screenXSMax]]),
    row('sm', t.screenSM, t.screenSMMax, [['screenSM', t.screenSM], ['screenSMMin', t.screenSMMin], ['screenSMMax', t.screenSMMax]]),
    row('md', t.screenMD, t.screenMDMax, [['screenMD', t.screenMD], ['screenMDMin', t.screenMDMin], ['screenMDMax', t.screenMDMax]]),
    row('lg', t.screenLG, t.screenLGMax, [['screenLG', t.screenLG], ['screenLGMin', t.screenLGMin], ['screenLGMax', t.screenLGMax]]),
    row('xl', t.screenXL, t.screenXLMax, [['screenXL', t.screenXL], ['screenXLMin', t.screenXLMin], ['screenXLMax', t.screenXLMax]]),
    row('xxl', t.screenXXL, t.screenXXLMax, [['screenXXL', t.screenXXL], ['screenXXLMin', t.screenXXLMin], ['screenXXLMax', t.screenXXLMax]]),
    row('xxxl', t.screenXXXL, undefined, [['screenXXXL', t.screenXXXL], ['screenXXXLMin', t.screenXXXLMin]]),
  ]
}

const breakpointOf = (width: number, rows: Row[]) => [...rows].reverse().find((r) => width >= r.min)?.bp ?? 'xs'
const shellOf = (width: number, t: Token): Shell => (width < t.screenMD ? 'phone' : width < t.screenLG ? 'tablet' : 'desktop')

const SHELL_TEXT: Record<Shell, { vi: string; en: string }> = {
  phone: {
    vi: 'Bố cục điện thoại: menu trong Drawer, tìm kiếm là nút icon, bộ lọc rộng hết màn hình',
    en: 'Phone layout: menu in a Drawer, search as an icon button, filters full width',
  },
  tablet: { vi: `Sider thu gọn còn ${SIDER_COLLAPSED}px`, en: `Sider collapsed to ${SIDER_COLLAPSED}px` },
  desktop: { vi: `Sider rộng ${SIDER_WIDTH}px`, en: `Sider ${SIDER_WIDTH}px wide` },
}

const TYPICAL: Record<Breakpoint, { vi: string; en: string }> = {
  xs: { vi: 'Điện thoại, màn hình dọc', en: 'Phones, portrait' },
  sm: { vi: 'Điện thoại xoay ngang, máy tính bảng nhỏ', en: 'Phones in landscape, small tablets' },
  md: { vi: 'Máy tính bảng, màn hình dọc', en: 'Tablets, portrait' },
  lg: { vi: 'Máy tính bảng xoay ngang, laptop nhỏ', en: 'Tablets in landscape, small laptops' },
  xl: { vi: 'Laptop và màn hình máy tính (1280, 1366, 1440)', en: 'Laptops and desktops (1280, 1366, 1440)' },
  xxl: { vi: 'Màn hình máy tính lớn', en: 'Large desktop monitors' },
  xxxl: { vi: 'Full HD (1920) trở lên', en: 'Full HD (1920) and wider' },
}

const range = (vi: boolean, min: number, max?: number) =>
  max === undefined ? (vi ? `từ ${min} trở lên` : `${min} and up`) : vi ? `${min} đến ${max}` : `${min} to ${max}`

// ---- code shown on the page (same in both languages) ----
const CODE_BREAKPOINT = `import { useState } from 'react'
import { Grid, theme } from '@fabi/ui'

function AppShell() {
  const { token } = theme.useToken()
  const screens = Grid.useBreakpoint()
  // {} on the first render: read the media query once so the first layout is already right
  const [phoneAtMount] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(\`(max-width: \${token.screenMD - 0.02}px)\`).matches,
  )
  const phone = screens.md === undefined ? phoneAtMount : !screens.md
  // …
}`

const CODE_COLUMNS = `<Row gutter={[token.margin, token.margin]}>
  <Col span={24}>
    <StatisticCard type="primary" title="Doanh thu (Gross)" value={9615933} suffix="₫" />
  </Col>
  <Col xs={24} sm={12} xl={6}>
    <StatisticCard title="Tổng hoá đơn" value={60} />
  </Col>
  {/* … three more StatisticCards with the same props */}
  <Col xs={24} xl={16}>
    <Card title="Doanh thu theo ngày">{/* chart */}</Card>
  </Col>
  <Col xs={24} xl={8}>
    <Card title="Top 5 mặt hàng bán chạy">{/* list */}</Card>
  </Col>
</Row>`

const CODE_SIDER = `// collapsed below lg from the first render, as the Sider's own breakpoint does later
const [collapsed, setCollapsed] = useState(
  () => typeof window !== 'undefined' && window.matchMedia(\`(max-width: \${token.screenLG - 0.02}px)\`).matches,
)

{phone ? (
  <Drawer title="Menu" placement="left" size={256} open={navOpen} onClose={() => setNavOpen(false)}>
    <Menu mode="inline" items={menuItems} />
  </Drawer>
) : (
  <Layout.Sider width={256} collapsedWidth={80} collapsed={collapsed} breakpoint="lg" onBreakpoint={setCollapsed}>
    <Menu mode="inline" items={menuItems} />
  </Layout.Sider>
)}`

const CODE_QUERIES = `const { token } = theme.useToken()
const wide = window.matchMedia(\`(min-width: \${token.screenXL}px)\`).matches
const phoneQuery = \`(max-width: \${token.screenSMMax}px)\` // below sm`

/** Live box: the frame width, what Grid.useBreakpoint() returns now and which app-shell rule applies. */
function CurrentScreen({ vi, rows, token }: { vi: boolean; rows: Row[]; token: Token }) {
  const screens = Grid.useBreakpoint()
  const [width, setWidth] = useState(() => (typeof window === 'undefined' ? 0 : window.innerWidth))
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  // useBreakpoint() is {} on the first render: fall back to the measured width until it fills in
  const known = Object.keys(screens).length > 0
  const current: Breakpoint = known ? ([...BREAKPOINTS].reverse().find((k) => k !== 'xs' && screens[k]) ?? 'xs') : breakpointOf(width, rows)
  const shell: Shell = known ? (!screens.md ? 'phone' : !screens.lg ? 'tablet' : 'desktop') : shellOf(width, token)
  const currentRow = rows.find((r) => r.bp === current)
  const value = known ? `{ ${BREAKPOINTS.map((k) => `${k}: ${screens[k] ?? false}`).join(', ')} }` : '{}'
  return (
    <Descriptions
      bordered
      size="small"
      column={1}
      // phones: each label above its value, so the long values get the full width
      layout={current === 'xs' ? 'vertical' : 'horizontal'}
      items={[
        { key: 'width', label: vi ? 'Chiều rộng khung này' : 'Width of this frame', children: `${width} px` },
        { key: 'screens', label: <Typography.Text code>Grid.useBreakpoint()</Typography.Text>, children: <Typography.Text code>{value}</Typography.Text> },
        {
          key: 'current',
          label: vi ? 'Breakpoint hiện tại' : 'Current breakpoint',
          children: <><Typography.Text code>{current}</Typography.Text> ({range(vi, currentRow?.min ?? 0, currentRow?.max)} px)</>,
        },
        { key: 'shell', label: vi ? 'Khung ứng dụng' : 'App shell', children: SHELL_TEXT[shell][vi ? 'vi' : 'en'] },
      ]}
    />
  )
}

/** Page in the language of the Language toolbar (VN / EN). */
export default function ResponsivePage() {
  const vi = useDocsLocale() === 'vi'
  const { token } = theme.useToken()
  const rows = breakpointRows(token)
  const L = (viText: string, enText: string) => (vi ? viText : enText)
  const { screenSM: sm, screenMD: md, screenLG: lg, screenXL: xl } = token
  // DatePicker panel width: 7 day cells (controlHeightSM × 1.5) plus the panel's side padding (padding + paddingXXS / 2)
  const pickerPanel = token.controlHeightSM * 1.5 * 7 + (token.padding + token.paddingXXS / 2) * 2
  const headerHeight = token.controlHeight * 2
  const shellColumns = [
    L(`Dưới md (< ${md})`, `Below md (< ${md})`),
    L(`Từ md đến lg (${md} đến ${token.screenMDMax})`, `md to lg (${md} to ${token.screenMDMax})`),
    L(`Từ lg trở lên (${lg}+)`, `lg and up (${lg}+)`),
  ]

  return (
    <>
      <h1 className="fabi-sb-page-title">{vi ? PAGE_TITLES_VI['Design Tokens/Responsive'] : 'Responsive'}</h1>
      {vi ? (
        <p>
          Mọi màn hình FABi CMS phải dùng tốt từ điện thoại rộng 320px đến màn hình máy tính lớn. Các mốc chiều rộng mà bố cục
          thay đổi là token breakpoint của theme: Grid, Col và <code>Grid.useBreakpoint()</code> đọc các token này,{' '}
          <code>Layout.Sider</code> dùng cùng các mốc. Nhờ vậy, màn hình dựng từ component <code>@fabi/ui</code> đổi bố cục ở
          đúng các mốc như phần còn lại của ứng dụng. Trang này liệt kê các breakpoint, quy tắc của khung ứng dụng FABi (Mẫu
          trang / Dashboard) và cách làm trong code.
        </p>
      ) : (
        <p>
          Every FABi CMS screen has to work from a 320px phone to a wide desktop monitor. The widths where a layout changes are
          the breakpoint tokens of the theme: Grid, Col and <code>Grid.useBreakpoint()</code> read them, and{' '}
          <code>Layout.Sider</code> uses the same widths. A screen built from <code>@fabi/ui</code> components therefore changes
          at the same widths as the rest of the app. This page lists the breakpoints, the rules of the FABi app shell (Template /
          Dashboard) and how to build them in code.
        </p>
      )}

      <h2 id="breakpoints">{L('Mốc màn hình (breakpoint)', 'Breakpoints')}</h2>
      <p>
        {L(
          'Giá trị dưới đây được đọc trực tiếp từ theme đang chọn, nên luôn khớp với code.',
          'The values below are read live from the selected theme, so they always match the code.',
        )}
      </p>
      {/* tabIndex on the tables: on narrow screens they scroll sideways (docs.css), so a keyboard can reach and scroll them */}
      <table aria-labelledby="breakpoints" tabIndex={0}>
        <thead>
          <tr>
            <th scope="col">{L('Breakpoint (prop của Col)', 'Breakpoint (Col prop)')}</th>
            <th scope="col">{L('Chiều rộng (px)', 'Width (px)')}</th>
            <th scope="col">Token</th>
            <th scope="col">{L('Màn hình thường gặp', 'Typical screen')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.bp}>
              <th scope="row"><code>{r.bp}</code></th>
              <td>{range(vi, r.min, r.max)}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                {r.tokens.map(([name, v], i) => (
                  <span key={name}>{i > 0 && <br />}<code>{name}</code> {v}</span>
                ))}
              </td>
              <td>{TYPICAL[r.bp][vi ? 'vi' : 'en']}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {vi ? (
        <ul>
          <li>
            Luôn đọc giá trị từ theme, không gõ số: lấy <code>token</code> từ <code>theme.useToken()</code> rồi dùng{' '}
            <code>token.screenMD</code>.
          </li>
          <li>
            <code>xs</code> trong Grid nghĩa là dưới {sm} (<code>screenXSMax</code>). Token <code>screenXS</code> ({token.screenXS})
            không phải mốc của Grid; <code>Layout.Sider</code> với <code>breakpoint="xs"</code> mới thu gọn khi dưới {token.screenXS}.
          </li>
          <li>
            Grid và <code>useBreakpoint()</code> dựng media query từ các token này: <code>xs</code> là <code>{rows[0].query}</code>,
            các mốc còn lại là <code>min-width</code> bằng mốc của nó, ví dụ <code>md</code> là <code>{rows[2].query}</code>.
          </li>
          <li>Token <code>Min</code> bằng đúng mốc của nó, token <code>Max</code> nhỏ hơn mốc kế tiếp 1px.</li>
          <li>
            Prop của Col áp dụng từ mốc của nó trở lên: <code>sm={'{12}'}</code> giữ từ {sm} cho đến khi một prop lớn hơn như{' '}
            <code>xl</code> thay thế.
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            Read the values from the theme, never type them: take <code>token</code> from <code>theme.useToken()</code>, then use{' '}
            <code>token.screenMD</code>.
          </li>
          <li>
            <code>xs</code> in Grid means below {sm} (<code>screenXSMax</code>). The <code>screenXS</code> token ({token.screenXS}) is
            not a Grid boundary; <code>Layout.Sider</code> with <code>breakpoint="xs"</code> collapses below {token.screenXS}.
          </li>
          <li>
            Grid and <code>useBreakpoint()</code> build their media queries from these tokens: <code>xs</code> is{' '}
            <code>{rows[0].query}</code>, every other key a <code>min-width</code> at its breakpoint, for example <code>md</code> is{' '}
            <code>{rows[2].query}</code>.
          </li>
          <li>Each <code>Min</code> token equals its breakpoint; each <code>Max</code> token is 1px below the next breakpoint.</li>
          <li>
            A Col prop applies from its breakpoint up: <code>sm={'{12}'}</code> holds from {sm} until a larger prop such as{' '}
            <code>xl</code> takes over.
          </li>
        </ul>
      )}

      <h2 id="current-screen">{L('Màn hình hiện tại', 'Current screen')}</h2>
      <p>
        {L(
          'Thay đổi kích thước cửa sổ trình duyệt: các giá trị bên dưới cập nhật theo. Trong Storybook, chiều rộng là chiều rộng của khung tài liệu này (trình duyệt trừ thanh bên), cũng là chiều rộng mà media query nhận được.',
          'Resize the browser window: the values below follow it. Inside Storybook the width is the width of this docs frame (the browser minus the sidebar), which is also the width media queries see.',
        )}
      </p>
      <DocUnstyled>
        <div className="fabi-sb-example">
          <div className="fabi-sb-example-preview fabi-sb-block">
            <CurrentScreen vi={vi} rows={rows} token={token} />
          </div>
        </div>
      </DocUnstyled>

      <h2 id="app-shell">{L('Khung ứng dụng FABi', 'FABi app shell')}</h2>
      <p>
        {L(
          'Khung ứng dụng của Mẫu trang / Dashboard (header, menu bên, thanh bộ lọc, nội dung) theo các quy tắc dưới đây. Màn hình mới dùng lại khung này nên cũng theo đúng các quy tắc đó.',
          'The app shell of Template / Dashboard (header, side menu, filter bar, content) follows the rules below. New screens reuse the shell, so they follow them too.',
        )}
      </p>
      <table aria-labelledby="app-shell" tabIndex={0}>
        <thead>
          <tr>
            <th scope="col">{L('Thành phần', 'Part')}</th>
            {shellColumns.map((c) => <th scope="col" key={c}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">{L('Menu bên', 'Side menu')}</th>
            <td>{L(
              `Không có Sider. Nút menu trên header mở menu trong Drawer bên trái, rộng ${DRAWER_WIDTH}px.`,
              `No Sider. The menu button in the header opens the menu in a Drawer from the left, ${DRAWER_WIDTH}px wide.`,
            )}</td>
            <td>{L(
              `Sider thu gọn còn ${SIDER_COLLAPSED}px (chỉ có icon). Nút “Mở” ở cuối menu để mở rộng.`,
              `Sider collapsed to ${SIDER_COLLAPSED}px (icons only). The expand button at the bottom opens it.`,
            )}</td>
            <td>{L(
              `Sider rộng ${SIDER_WIDTH}px. Nút “Thu gọn” ở cuối menu thu về ${SIDER_COLLAPSED}px.`,
              `Sider ${SIDER_WIDTH}px wide. The collapse button at the bottom shrinks it to ${SIDER_COLLAPSED}px.`,
            )}</td>
          </tr>
          <tr>
            <th scope="row">{L('Tìm kiếm', 'Search')}</th>
            <td>{L('Nút icon trên header mở SearchModal.', 'An icon button in the header opens SearchModal.')}</td>
            <td colSpan={2}>{L(
              `Ô tìm kiếm trên header, rộng tối đa ${SEARCH_MAX}px, kèm gợi ý phím Ctrl K (⌘ K trên Mac), mở SearchModal.`,
              `A search field in the header, up to ${SEARCH_MAX}px wide with the Ctrl K hint (⌘ K on a Mac), opens SearchModal.`,
            )}</td>
          </tr>
          <tr>
            <th scope="row">{L('Nút trên header', 'Header actions')}</th>
            <td>{L(
              'Chỉ có avatar, ẩn tên tài khoản. Trợ lý AI và ngôn ngữ chuyển lên đầu menu tài khoản; nút thông báo giữ nguyên.',
              'Avatar without the account name. The AI assistant and the language move to the top of the account menu; notifications stay.',
            )}</td>
            <td colSpan={2}>{L('Trợ lý AI, ngôn ngữ, thông báo và tài khoản kèm tên.', 'AI assistant, language, notifications, and the account with its name.')}</td>
          </tr>
          <tr>
            <th scope="row">{L('Khoảng cách header', 'Header spacing')}</th>
            <td>{L(`Lề hai bên ${token.padding}, khoảng cách ${token.marginXS}.`, `Side padding ${token.padding}, gap ${token.marginXS}.`)}</td>
            <td colSpan={2}>{L(`Lề hai bên ${token.paddingLG}, khoảng cách ${token.margin}.`, `Side padding ${token.paddingLG}, gap ${token.margin}.`)}</td>
          </tr>
          <tr>
            <th scope="row">{L('Thanh bộ lọc', 'Filter bar')}</th>
            <td>{L(
              `Mỗi ô rộng hết màn hình. Khoảng ngày tách thành hai DatePicker (“Từ ngày”, “Đến ngày”): popup của RangePicker rộng ${pickerPanel * 2}px, popup của một DatePicker chỉ ${pickerPanel}px.`,
              `Each field takes the full width. The date range is two DatePickers (start date, end date): the RangePicker popup is ${pickerPanel * 2}px wide, a single DatePicker popup ${pickerPanel}px.`,
            )}</td>
            <td colSpan={2}>{L(
              `Một RangePicker; Select nhà hàng rộng tối thiểu ${SELECT_MIN}px. Các ô xuống dòng khi không đủ chỗ.`,
              `One RangePicker; the restaurant Select is at least ${SELECT_MIN}px wide. Fields wrap to the next line when they do not fit.`,
            )}</td>
          </tr>
        </tbody>
      </table>

      <h3 id="every-width">{L('Ở mọi chiều rộng', 'At every width')}</h3>
      {vi ? (
        <ul>
          <li>
            Header dính trên cùng. Sider dính ngay bên dưới (cách đỉnh {headerHeight}px, bằng chiều cao header) và cao đúng một
            màn hình: menu cuộn bên trong, thanh cuộn chỉ hiện khi con trỏ hoặc focus ở trong menu, nút “Thu gọn” luôn nằm ở cuối.
          </li>
          <li>
            Khi chiều rộng vượt qua mốc {lg}, Sider tự thu gọn hoặc mở rộng (<code>breakpoint="lg"</code>); người dùng vẫn bấm để
            đổi được.
          </li>
          <li>
            Thanh bộ lọc có padding {token.paddingSM} × {token.padding}, vùng nội dung có padding {token.padding} và các card cách
            nhau {token.margin}.
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            The header is sticky at the top. The Sider is sticky right under it ({headerHeight}px from the top, the header height)
            and one screen tall: its menu scrolls inside, the scrollbar shows only while the pointer or the focus is in the menu,
            and the collapse button stays at the bottom.
          </li>
          <li>
            Crossing {lg} collapses or expands the Sider by itself (<code>breakpoint="lg"</code>); the user can still toggle it.
          </li>
          <li>
            The filter bar has a padding of {token.paddingSM} × {token.padding}, the content a padding of {token.padding}, with{' '}
            {token.margin} between cards.
          </li>
        </ul>
      )}

      <h3 id="content-grid">{L('Lưới nội dung', 'Content grid')}</h3>
      <table aria-labelledby="content-grid" tabIndex={0}>
        <thead>
          <tr>
            <th scope="col">Card</th>
            <th scope="col">{L('Prop của Col', 'Col props')}</th>
            <th scope="col">{L('Kết quả', 'Result')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">{L('Doanh thu', 'Revenue figure')} (<code>StatisticCard type="primary"</code>)</th>
            <td><code>span={'{24}'}</code></td>
            <td>{L('Luôn rộng hết hàng.', 'Always full width.')}</td>
          </tr>
          <tr>
            <th scope="row">{L('4 StatisticCard: Giảm giá và chi phí, Tổng hoá đơn, Số khách, Số hoá đơn điện tử', '4 StatisticCards: discounts and costs, total invoices, customers, e-invoices')}</th>
            <td><code>xs={'{24}'} sm={'{12}'} xl={'{6}'}</code></td>
            <td>{L(`1 card mỗi hàng dưới ${sm}, 2 card từ ${sm}, 4 card từ ${xl}.`, `1 per row below ${sm}, 2 from ${sm}, 4 from ${xl}.`)}</td>
          </tr>
          <tr>
            <th scope="row">{L('Doanh thu theo ngày (biểu đồ cột), Top 5 mặt hàng bán chạy', 'Revenue by day (column chart), top 5 best-selling items')}</th>
            <td><code>xs={'{24}'} xl={'{16}'}</code>, <code>xs={'{24}'} xl={'{8}'}</code></td>
            <td>{L(`Rộng hết hàng dưới ${xl}; từ ${xl} chia 2/3 và 1/3.`, `Full width below ${xl}; two thirds and one third from ${xl}.`)}</td>
          </tr>
          <tr>
            <th scope="row">{L('Top 5 nguồn đơn, Top 5 chương trình khuyến mại, Top 5 phương thức thanh toán (biểu đồ tròn)', 'Top 5 order sources, top 5 promotions, top 5 payment methods (donut chart)')}</th>
            <td><code>xs={'{24}'} lg={'{8}'}</code></td>
            <td>{L(`Rộng hết hàng dưới ${lg}; 3 card mỗi hàng từ ${lg}.`, `Full width below ${lg}; 3 per row from ${lg}.`)}</td>
          </tr>
          <tr>
            <th scope="row">{L('Đơn từ kênh: Shopee, Báo cáo lãi lỗ tháng', 'Orders by channel: Shopee, monthly profit and loss')}</th>
            <td><code>xs={'{24}'} xl={'{12}'}</code></td>
            <td>{L(`Rộng hết hàng dưới ${xl}; 2 card mỗi hàng từ ${xl}.`, `Full width below ${xl}; 2 per row from ${xl}.`)}</td>
          </tr>
        </tbody>
      </table>
      <p>
        {vi ? (
          <>Biểu đồ cột tự ẩn nhãn trục x không đủ chỗ (<code>labelAutoHide</code>) thay vì để các nhãn chồng lên nhau.</>
        ) : (
          <>The column chart hides x-axis labels that do not fit (<code>labelAutoHide</code>) instead of letting them overlap.</>
        )}
      </p>

      <h3 id="search-modal">SearchModal</h3>
      {vi ? (
        <ul>
          <li>
            Rộng {SEARCH_MODAL_WIDTH}px nhưng không bao giờ rộng hơn màn hình: hộp thoại chừa {token.margin}px mỗi bên, còn{' '}
            {token.marginXS}px khi dưới {sm}.
          </li>
          <li>Cao {SEARCH_MODAL_HEIGHT}px nhưng không cao hơn màn hình trừ {token.padding * 2}px; danh sách kết quả cuộn bên trong.</li>
          <li>
            Dưới sm ({sm}): ẩn dòng gợi ý phím (ESC, ↑ ↓, Enter) vì điện thoại không có bàn phím, và hiện nút “Đóng” cạnh ô tìm
            kiếm.
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            {SEARCH_MODAL_WIDTH}px wide, never wider than the screen: the dialog leaves {token.margin}px on each side,{' '}
            {token.marginXS}px below {sm}.
          </li>
          <li>{SEARCH_MODAL_HEIGHT}px tall, never taller than the screen minus {token.padding * 2}px; the result list scrolls inside.</li>
          <li>
            Below sm ({sm}): the key hints (ESC, ↑ ↓, Enter) are hidden, since phones have no keyboard, and a close button sits
            next to the field.
          </li>
        </ul>
      )}

      <h2 id="in-code">{L('Trong code', 'In code')}</h2>
      <h3 id="read-breakpoint">{L('Đọc breakpoint hiện tại', 'Read the current breakpoint')}</h3>
      {vi ? (
        <>
          <p>
            <code>Grid.useBreakpoint()</code> trả về <code>{'{ xs, sm, md, lg, xl, xxl, xxxl }'}</code>. Mỗi khoá là{' '}
            <code>true</code> từ mốc của nó trở lên, riêng <code>xs</code> chỉ <code>true</code> khi dưới {sm}. Dùng hook này cho
            phần đổi hình dạng (Sider hay Drawer, ô tìm kiếm hay nút icon); còn độ rộng cột thì dùng prop của Col, vốn chỉ là CSS.
          </p>
          <p>
            <strong>Lưu ý:</strong> <code>useBreakpoint()</code> trả về <code>{'{}'}</code> ở lần render đầu rồi mới có giá trị
            ngay sau đó. Khi đó <code>!screens.md</code> là <code>true</code> trên máy tính, còn <code>screens.md === false</code>{' '}
            là <code>false</code> trên điện thoại, nên một trong hai sẽ có bố cục đầu tiên bị sai. Biểu đồ được mount trong lần
            render đó đo một card đang rộng 0px, quay về độ rộng mặc định 640px và giữ nguyên, rộng hơn cả màn hình điện thoại. Hãy
            đọc media query một lần trong hàm khởi tạo của <code>useState</code>, như Mẫu trang / Dashboard:
          </p>
        </>
      ) : (
        <>
          <p>
            <code>Grid.useBreakpoint()</code> returns <code>{'{ xs, sm, md, lg, xl, xxl, xxxl }'}</code>. Each key is{' '}
            <code>true</code> from its width up, except <code>xs</code>, which is <code>true</code> only below {sm}. Use it for
            parts that change shape (Sider or Drawer, search field or icon button); for column widths use Col props, which are
            plain CSS.
          </p>
          <p>
            <strong>Pitfall:</strong> <code>useBreakpoint()</code> returns <code>{'{}'}</code> on the first render and fills in
            right after. <code>!screens.md</code> is then <code>true</code> on a desktop, and <code>screens.md === false</code> is{' '}
            <code>false</code> on a phone, so one of them gets a wrong first layout. Charts that mount in that pass measure a card
            that is still 0px wide, fall back to their default width of 640px and keep it, wider than the phone. Read the media
            query once in a <code>useState</code> initialiser, as Template / Dashboard does:
          </p>
        </>
      )}
      <Source code={CODE_BREAKPOINT} language="tsx" dark />
      <p>
        {vi ? (
          <><code>- 0.02</code>: cùng giá trị max-width mà <code>Layout.Sider</code> dùng ({md - 0.02}px), nên không có chiều rộng nào khớp cả hai query.</>
        ) : (
          <><code>- 0.02</code>: the same max-width <code>Layout.Sider</code> uses ({md - 0.02}px), so no width matches both queries.</>
        )}
      </p>

      <h3 id="columns">{L('Chia cột', 'Columns')}</h3>
      <p>
        {vi ? (
          <>
            Prop của Col áp dụng từ mốc của nó trở lên, cho đến khi gặp prop của mốc lớn hơn. Prop nhận số cột (trên 24) hoặc
            một object: <code>md={'{{ span: 12, offset: 6 }}'}</code>. Khoảng cách giữa các cột (gutter) cũng lấy từ token.
          </>
        ) : (
          <>
            A Col prop applies from its breakpoint up, until a larger one is set. It takes a span (out of 24) or an object:{' '}
            <code>md={'{{ span: 12, offset: 6 }}'}</code>. Gutters come from tokens too.
          </>
        )}
      </p>
      <Source code={CODE_COLUMNS} language="tsx" dark />

      <h3 id="side-menu">{L('Menu bên', 'Side menu')}</h3>
      <p>
        {vi ? (
          <>
            <code>breakpoint="lg"</code> khiến Sider gọi <code>onBreakpoint(true)</code> khi dưới {lg} và{' '}
            <code>onBreakpoint(false)</code> từ {lg}, nên Sider tự thu gọn và mở rộng. Khởi tạo <code>collapsed</code> từ cùng
            media query, nếu không máy tính bảng sẽ hiện Sider {SIDER_WIDTH}px trước rồi mới co lại. Dưới md, dùng Drawer thay cho
            Sider.
          </>
        ) : (
          <>
            <code>breakpoint="lg"</code> makes the Sider call <code>onBreakpoint(true)</code> below {lg} and{' '}
            <code>onBreakpoint(false)</code> from {lg}, so it collapses and expands by itself. Start <code>collapsed</code> from
            the same media query, or a tablet first shows the {SIDER_WIDTH}px Sider and then jumps. Below md, render a Drawer
            instead of the Sider.
          </>
        )}
      </p>
      <Source code={CODE_SIDER} language="tsx" dark />
      <p>
        {vi ? (
          <>
            <code>Layout.Sider</code> dùng các mốc cố định, không đọc token: từ sm đến xxl trùng với token, nhưng <code>xs</code>{' '}
            của nó là dưới 480 và <code>xxxl</code> là dưới 1840.
          </>
        ) : (
          <>
            <code>Layout.Sider</code> uses fixed widths, not the tokens: they match the tokens from sm to xxl, but its{' '}
            <code>xs</code> means below 480 and its <code>xxxl</code> below 1840.
          </>
        )}
      </p>

      <h3 id="media-queries">{L('Media query tự viết', 'Your own media queries')}</h3>
      <p>
        {L(
          'Viết chiều rộng từ token, không gõ số, để mọi màn hình đổi bố cục ở cùng các mốc:',
          'Write widths from the tokens, never as numbers, so every screen changes at the same widths:',
        )}
      </p>
      <Source code={CODE_QUERIES} language="tsx" dark />

      <h2 id="viewport-toolbar">{L('Thanh Viewport', 'Viewport toolbar')}</h2>
      <p>
        {L(
          'Thanh công cụ Viewport của Storybook đổi kích thước canvas của một story (ví dụ Mẫu trang / Dashboard ở tab Canvas) theo các cỡ dưới đây. Trang tài liệu như trang này không có công cụ đó: hãy thay đổi kích thước cửa sổ trình duyệt.',
          'The Viewport toolbar of Storybook resizes the canvas of a story (for example Template / Dashboard in its Canvas tab) to the sizes below. Docs pages such as this one do not show it: resize the browser window instead.',
        )}
      </p>
      <table aria-labelledby="viewport-toolbar" tabIndex={0}>
        <thead>
          <tr>
            <th scope="col">{L('Tên', 'Name')}</th>
            <th scope="col">{L('Kích thước (px)', 'Size (px)')}</th>
            <th scope="col">Breakpoint</th>
            <th scope="col">{L('Khung ứng dụng', 'App shell')}</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(VIEWPORTS).map(([key, v]) => {
            const w = Number.parseInt(v.styles.width, 10)
            return (
              <tr key={key}>
                <th scope="row">{v.name}</th>
                <td>{Number.parseInt(v.styles.width, 10)} × {Number.parseInt(v.styles.height, 10)}</td>
                <td><code>{breakpointOf(w, rows)}</code></td>
                <td>{SHELL_TEXT[shellOf(w, token)][vi ? 'vi' : 'en']}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <h2 id="checklist">{L('Checklist cho mỗi màn hình mới', 'Checklist for every new screen')}</h2>
      {vi ? (
        <ul>
          <li>
            Kiểm tra ở chiều rộng 320, 375, 768 và 1366 px, và tải lại trang ở từng chiều rộng thay vì chỉ kéo cửa sổ: bố cục ở lần
            render đầu rất quan trọng (xem lưu ý ở trên). Thanh Viewport có sẵn 375 và 768; với 320 và 1366, dùng chế độ thiết bị
            của trình duyệt.
          </li>
          <li>Trang không có thanh cuộn ngang. Chỉ bảng rộng mới được cuộn ngang, bên trong card của nó.</li>
          <li>Các nút trên header không chồng lên nhau: logo, tìm kiếm và các nút nằm trên một hàng.</li>
          <li>Mọi popup nằm gọn trong màn hình: Dropdown, Select, DatePicker, Modal, Drawer, SearchModal.</li>
          <li>Biểu đồ nằm gọn trong card: không biểu đồ nào rộng hơn card, nhãn trục không chồng lên nhau.</li>
        </ul>
      ) : (
        <ul>
          <li>
            Check at 320, 375, 768 and 1366 px wide, and reload the page at each width instead of only dragging the window: the
            first layout matters (see the pitfall above). The Viewport toolbar has 375 and 768; for 320 and 1366 use the
            browser's device mode.
          </li>
          <li>No horizontal scroll on the page. Only a wide table may scroll, inside its card.</li>
          <li>Header controls never overlap: logo, search and actions stay on one line.</li>
          <li>Every popup fits the screen: Dropdown, Select, DatePicker, Modal, Drawer, SearchModal.</li>
          <li>Charts fit their cards: none is wider than its card, and axis labels do not overlap.</li>
        </ul>
      )}
    </>
  )
}
