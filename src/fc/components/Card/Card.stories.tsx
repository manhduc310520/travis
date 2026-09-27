import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Building02, DotsHorizontal, Edit01, Settings01 } from '../../../icons'
import { Avatar } from '../Avatar/Avatar'
import { StatusBadge } from '../Badge/Badge'
import { Button } from '../Button/Button'
import { Col, Row } from '../Grid/Grid'
import { Image } from '../Image/Image'
import type { TabsItem } from '../Tabs/Tabs'
import { Link } from '../Typography/Typography'
import { Card, CardMeta, type CardSize } from './Card'

// Local stand-in photo (SVG), so stories never depend on the network.
const PHO = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd591"/><stop offset="1" stop-color="#8c4a1a" stop-opacity=".55"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><ellipse cx="200" cy="240" rx="150" ry="80" fill="#8c4a1a"/><ellipse cx="200" cy="215" rx="136" ry="56" fill="#f6c46b"/><circle cx="160" cy="205" r="16" fill="#fff" opacity=".7"/><circle cx="238" cy="214" r="12" fill="#fff" opacity=".6"/></svg>',
)}`

const text = (s: string) => <p style={{ margin: 0 }}>{s}</p>
const more = <Link href="#">Xem thêm</Link>

const tabItems: TabsItem[] = [
  { key: 'today', label: 'Hôm nay', content: text('42 đơn · doanh thu 12.450.000 ₫') },
  { key: 'week', label: 'Tuần này', content: text('286 đơn · doanh thu 81.300.000 ₫') },
]

const actions = [
  <Button key="settings" variant="text" size="sm" iconStart={<Settings01 />} aria-label="Cài đặt chi nhánh" />,
  <Button key="edit" variant="text" size="sm" iconStart={<Edit01 />} aria-label="Sửa chi nhánh" />,
  <Button key="more" variant="text" size="sm" iconStart={<DotsHorizontal />} aria-label="Thao tác khác" />,
]

const meta = {
  title: 'Components/Card',
  component: Card,
  args: {
    title: 'Chi nhánh Quận 1',
    extra: more,
    size: 'md',
    variant: 'outlined',
    inner: false,
    isLoading: false,
    children: text('Mở cửa 07:00 – 22:00 · 24 bàn · 6 nhân viên đang ca.'),
    style: { maxWidth: 320 },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    variant: { control: 'inline-radio', options: ['outlined', 'borderless'] },
    titleLevel: { control: 'select', options: [2, 3, 4, 5, 6] },
    extra: { control: false },
    cover: { control: false },
    actions: { control: false },
    tabs: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Card>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--fc-space-margin-xl)' } as const
const caption = {
  marginBottom: 'var(--fc-space-margin-xxs)',
  color: 'var(--fc-color-content-description)',
  fontSize: 'var(--fc-typography-size-sm)',
  lineHeight: 'var(--fc-typography-line-height-sm)',
} as const

function Captioned({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div style={caption}>{label}</div>
      {children}
    </div>
  )
}

/** A borderless card is told apart by tone, so it sits on the Layout background. */
function LayoutBackground({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: 'var(--fc-space-padding-lg)', borderRadius: 'var(--fc-radius-lg)', background: 'var(--fc-color-background-layout)' }}>
      {children}
    </div>
  )
}

const SIZES: [CardSize, string][] = [['md', 'Medium'], ['sm', 'Small']]

/** Figma `Card / Basic` Size=Medium, Borderless=False, Tabs=False. */
export const Playground: Story = {}

/** Figma `Card / Basic` Size: Medium (header 56) / Small (header 38, padding 12). */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ ...stack, gridTemplateColumns: 'repeat(2, minmax(0, 320px))' }}>
      {SIZES.map(([size, label]) => (
        <Captioned key={size} label={`Size=${label}`}>
          <Card {...args} size={size} style={undefined} />
        </Captioned>
      ))}
    </div>
  ),
}

/** Figma `Card / Basic` Borderless=True (Tabs False / True), on the Layout background. */
export const Borderless: Story = {
  render: (args) => (
    <LayoutBackground>
      <div style={{ ...stack, gridTemplateColumns: 'repeat(2, minmax(0, 320px))' }}>
        <Card {...args} variant="borderless" style={undefined} />
        <Card {...args} variant="borderless" style={undefined} tabs={{ items: tabItems, 'aria-label': 'Kỳ báo cáo' }}>
          {undefined}
        </Card>
      </div>
    </LayoutBackground>
  ),
}

/**
 * Figma `Card / Basic` Tabs=True, Size Medium / Small: an fc `Tabs` strip under
 * the header; the tab panel is the body.
 */
export const WithTabs: Story = {
  render: (args) => (
    <div style={{ ...stack, gridTemplateColumns: 'repeat(2, minmax(0, 320px))' }}>
      {SIZES.map(([size, label]) => (
        <Captioned key={size} label={`Size=${label}, Tabs=True`}>
          <Card {...args} size={size} style={undefined} title="Doanh thu" tabs={{ items: tabItems, 'aria-label': `Kỳ báo cáo (${label})` }}>
            {undefined}
          </Card>
        </Captioned>
      ))}
    </div>
  ),
}

/** Figma `Card / Inner` and `Card / Basic with Inner inside`: tinted headers, nested in a card body. */
export const Inner: Story = {
  render: () => (
    <Card title="Chi nhánh Quận 1" extra={more} style={{ maxWidth: 400 }}>
      <div style={{ display: 'grid', gap: 'var(--fc-space-margin-base)' }}>
        <Card inner title="Ca sáng" extra={<Link href="#">Chi tiết</Link>}>
          {text('07:00 – 14:00 · 3 thu ngân, 5 phục vụ.')}
        </Card>
        <Card inner title="Ca tối" extra={<Link href="#">Chi tiết</Link>}>
          {text('14:00 – 22:00 · 2 thu ngân, 6 phục vụ.')}
        </Card>
      </div>
    </Card>
  ),
}

const cover = <Image src={PHO} alt="Phở bò tái chín" ratio="1:1" width="100%" preview={false} />

/**
 * Figma `Card / Advanced` Type=Advanced / Simple, Image True / False: cover +
 * `CardMeta` (avatar, title, description) + actions row (icon-only text buttons).
 */
export const Advanced: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--fc-space-margin-lg)', alignItems: 'flex-start' }}>
      <Captioned label="Type=Advanced, Image=True">
        <Card cover={cover} actions={actions} style={{ width: 280 }}>
          <CardMeta
            avatar={<Avatar alt="Chi nhánh Quận 1" icon={<Building02 />} />}
            title="Phở Hà Nội – Quận 1"
            description="12 Lê Lợi, Bến Nghé"
          />
        </Card>
      </Captioned>
      <Captioned label="Type=Simple, Image=True">
        <Card cover={cover} style={{ width: 240 }}>
          <CardMeta title="Phở bò tái chín" description="65.000 ₫ · Món chính" />
        </Card>
      </Captioned>
      <Captioned label="Type=Advanced, Image=False">
        <Card actions={actions} style={{ width: 280 }}>
          <CardMeta
            avatar={<Avatar alt="Chi nhánh Quận 3" icon={<Building02 />} />}
            title="Phở Hà Nội – Quận 3"
            description="88 Võ Văn Tần, Phường 6"
          />
        </Card>
      </Captioned>
      <Captioned label="Type=Simple, Image=False">
        <Card style={{ width: 240 }}>
          <CardMeta title="Bún bò Huế" description="70.000 ₫ · Món chính" />
        </Card>
      </Captioned>
    </div>
  ),
}

/** Placeholder body while data loads (not a Figma variant). Screen readers hear "Đang tải nội dung" (Loading content). */
export const Loading: Story = { args: { isLoading: true } }

/**
 * Figma `Card / Grid` Columns: 4 / 3 / 2 — `Card / Basic` Tabs=True cards laid out
 * with fc `Row` / `Col` and a 16px gap (one column on phones, two from `sm`).
 */
export const Grid: Story = {
  render: () => (
    <div style={stack}>
      {[4, 3, 2].map((columns) => (
        <Captioned key={columns} label={`Columns=${columns}`}>
          <Row gap="base">
            {Array.from({ length: columns }, (_, i) => (
              <Col key={i} span={24} sm={12} lg={24 / columns}>
                <Card
                  title={`Chi nhánh ${i + 1}`}
                  extra={<StatusBadge status={i % 2 ? 'default' : 'success'}>{i % 2 ? 'Đóng cửa' : 'Đang mở'}</StatusBadge>}
                  tabs={{ items: tabItems, 'aria-label': `Kỳ báo cáo – chi nhánh ${i + 1} (${columns} cột)` }}
                />
              </Col>
            ))}
          </Row>
        </Captioned>
      ))}
    </div>
  ),
}
