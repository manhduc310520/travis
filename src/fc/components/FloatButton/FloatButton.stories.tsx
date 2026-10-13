import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties, ReactNode } from 'react'
import { Bell01, Edit01, File06, HelpCircle, Phone, Plus, Receipt, Settings01, ShoppingCart01 } from '../../../icons'
import { FloatButton, FloatButtonGroup, FloatButtonMenu } from './FloatButton'

const meta: Meta<typeof FloatButton> = {
  title: 'Components/General/FloatButton',
  component: FloatButton,
  args: { type: 'default', shape: 'square', 'aria-label': 'Trợ giúp', icon: <HelpCircle /> },
  argTypes: {
    type: { control: 'select', options: ['default', 'primary'], description: 'Figma Type.' },
    shape: { control: 'select', options: ['square', 'circle'], description: 'Figma Shape.' },
    description: { control: 'text', description: 'Figma Description: short text under the icon.' },
    tooltip: { control: 'text', description: 'Figma Tooltip.' },
    badge: { control: 'object', description: 'Figma Badge: `{ dot: true }` or `{ count: 5 }`.' },
    icon: { control: false },
    affix: { control: 'boolean', description: 'Pin to the viewport bottom-right corner.' },
  },
}
export default meta
type Story = StoryObj<typeof FloatButton>

const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start', padding: 16 }
const cellStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }
const caption: CSSProperties = { fontSize: 12, color: 'var(--fc-color-content-description)' }

/** Figma variant name above the example. */
const Cell = ({ label, children }: { label: string; children: ReactNode }) => (
  <div style={cellStyle}>
    <span style={caption}>{label}</span>
    {children}
  </div>
)

/** Figma `FloatButton` Type=Default, Shape=Square, Badge=None — the typical help button. */
export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 16 }}>
      <FloatButton {...args} />
    </div>
  ),
}

/**
 * Figma Type=Default|Primary × Shape=Square|Circle. One primary per surface: each cell is its own example.
 * Figma State=Hover shows on real hover: Default adds Fill/Area over Elevated, Primary turns Solid/Accent-Hover.
 * Disabled is not a Figma variant (kept for completeness).
 */
export const TypesAndShapes: Story = {
  render: () => (
    <div style={row}>
      <Cell label="Default · Square"><FloatButton aria-label="Trợ giúp" icon={<HelpCircle />} /></Cell>
      <Cell label="Default · Circle"><FloatButton shape="circle" aria-label="Trợ giúp" icon={<HelpCircle />} /></Cell>
      <Cell label="Primary · Square"><FloatButton type="primary" aria-label="Tạo đơn mới" icon={<Plus />} /></Cell>
      <Cell label="Primary · Circle"><FloatButton type="primary" shape="circle" aria-label="Tạo đơn mới" icon={<Plus />} /></Cell>
      <Cell label="Disabled"><FloatButton aria-label="Trợ giúp" icon={<HelpCircle />} isDisabled /></Cell>
    </div>
  ),
}

/** Figma Badge=None|Dot|Small on every Type × Shape (Figma examples "Badge=Small", "Primary (+Badge)", "Circle (+Badge)"). */
export const Badges: Story = {
  render: () => (
    <div style={row}>
      <Cell label="Default · Square · Dot"><FloatButton aria-label="Thông báo" icon={<Bell01 />} badge={{ dot: true, label: 'Có thông báo mới' }} /></Cell>
      <Cell label="Default · Square · Small"><FloatButton aria-label="Đơn chờ xác nhận" icon={<Receipt />} badge={{ count: 5, label: '5 đơn chờ' }} /></Cell>
      <Cell label="Default · Circle · Dot"><FloatButton shape="circle" aria-label="Thông báo" icon={<Bell01 />} badge={{ dot: true, label: 'Có thông báo mới' }} /></Cell>
      <Cell label="Default · Circle · Small"><FloatButton shape="circle" aria-label="Giỏ hàng" icon={<ShoppingCart01 />} badge={{ count: 12, label: '12 món' }} /></Cell>
      <Cell label="Primary · Square · Small"><FloatButton type="primary" aria-label="Đơn mới" icon={<Receipt />} badge={{ count: 3, label: '3 đơn mới' }} /></Cell>
      <Cell label="Primary · Circle · Small"><FloatButton type="primary" shape="circle" aria-label="Đơn mới" icon={<Receipt />} badge={{ count: 120, label: '120 đơn mới' }} /></Cell>
    </div>
  ),
}

/** Figma Description: one short line under the icon; the button stays 40 × 40 on both shapes. */
export const WithDescription: Story = {
  render: () => (
    <div style={row}>
      <Cell label="Default · Square"><FloatButton icon={<File06 />} description="Đơn" /></Cell>
      <Cell label="Default · Circle"><FloatButton shape="circle" icon={<File06 />} description="Đơn" /></Cell>
      <Cell label="Primary · Square"><FloatButton type="primary" icon={<Plus />} description="Thêm" /></Cell>
      <Cell label="Primary · Circle"><FloatButton type="primary" shape="circle" icon={<Plus />} description="Thêm" /></Cell>
      <Cell label="Description only"><FloatButton description="Hỗ trợ" /></Cell>
    </div>
  ),
}

/** Figma Tooltip: hover or focus the button. The first one is shown open. */
export const WithTooltip: Story = {
  render: () => (
    <div style={{ ...row, paddingInlineStart: 200 }}>
      <FloatButton aria-label="Gọi hỗ trợ" icon={<Phone />} tooltip="Gọi tổng đài 1900 6000" tooltipDefaultOpen />
      <FloatButton type="primary" shape="circle" aria-label="Tạo đơn mới" icon={<Plus />} tooltip="Tạo đơn mới" tooltipPlacement="top" />
    </div>
  ),
}

const groupItems = (circle = false, count = 6) =>
  [
    <FloatButton key="h" shape={circle ? 'circle' : 'square'} aria-label="Trợ giúp" icon={<HelpCircle />} badge={circle ? { dot: true, label: 'Mới' } : undefined} />,
    <FloatButton key="r" shape={circle ? 'circle' : 'square'} aria-label="Hóa đơn" icon={<Receipt />} badge={circle ? { dot: true, label: 'Mới' } : undefined} />,
    <FloatButton key="c" shape={circle ? 'circle' : 'square'} aria-label="Giỏ hàng" icon={<ShoppingCart01 />} badge={circle ? { dot: true, label: 'Mới' } : undefined} />,
    <FloatButton key="e" shape={circle ? 'circle' : 'square'} aria-label="Sửa thực đơn" icon={<Edit01 />} badge={circle ? { dot: true, label: 'Mới' } : undefined} />,
    <FloatButton key="b" shape={circle ? 'circle' : 'square'} aria-label="Thông báo" icon={<Bell01 />} badge={circle ? { dot: true, label: 'Mới' } : undefined} />,
    <FloatButton key="s" shape={circle ? 'circle' : 'square'} aria-label="Cài đặt" icon={<Settings01 />} />,
  ].slice(0, count)

/**
 * Figma `FloatButton Group`: Type=Square|Circle × Direction=Vertical|Horizontal.
 * Square: one panel; items are flat Group Items (hover = Background/Item-Hover) with a hairline between them.
 * Circle: separate buttons Space/Margin/Base apart.
 */
export const Group: Story = {
  render: () => (
    <div style={row}>
      <Cell label="Square · Vertical"><FloatButtonGroup aria-label="Công cụ nhanh">{groupItems()}</FloatButtonGroup></Cell>
      <Cell label="Square · Horizontal"><FloatButtonGroup aria-label="Công cụ nhanh" direction="horizontal">{groupItems()}</FloatButtonGroup></Cell>
      <Cell label="Circle · Vertical"><FloatButtonGroup aria-label="Công cụ nhanh" shape="circle">{groupItems(true, 5)}</FloatButtonGroup></Cell>
      <Cell label="Circle · Horizontal"><FloatButtonGroup aria-label="Công cụ nhanh" shape="circle" direction="horizontal">{groupItems(true, 5)}</FloatButtonGroup></Cell>
    </div>
  ),
}

/**
 * Figma `FloatButton Menu` Open=No (the Figma trigger carries Badge=Dot): click the primary
 * trigger to open the items above it; Escape closes the menu and returns focus to the trigger.
 * The items group is named "Công cụ nhanh" (`itemsLabel`) and the trigger points to it with `aria-controls`.
 */
export const Menu: Story = {
  render: () => (
    <div style={{ ...row, minHeight: 360, alignItems: 'flex-end' }}>
      <FloatButtonMenu placement="top" badge={{ dot: true, label: 'Có thông báo mới' }}>{groupItems(true, 5)}</FloatButtonMenu>
    </div>
  ),
}

type MenuPlacement = 'top' | 'bottom' | 'left' | 'right'

/** Room for the open items: the Menu box is only the trigger, the items float beside it. */
const MenuStage = ({ placement }: { placement: MenuPlacement }) => {
  const vertical = placement === 'top' || placement === 'bottom'
  const style: CSSProperties = {
    display: 'flex',
    width: vertical ? 48 : 336,
    height: vertical ? 336 : 48,
    alignItems: placement === 'top' ? 'flex-end' : placement === 'bottom' ? 'flex-start' : 'center',
    justifyContent: placement === 'left' ? 'flex-end' : placement === 'right' ? 'flex-start' : 'center',
  }
  return (
    <div style={style}>
      <FloatButtonMenu placement={placement} defaultOpen>{groupItems(true, 5)}</FloatButtonMenu>
    </div>
  )
}

/** Figma `FloatButton Menu` Open=Yes × Placement=Top|Bottom|Right|Left, shown open (docs examples "Menu open top" and "Menu open right"). */
export const MenuPlacements: Story = {
  render: () => (
    <div style={{ ...row, gap: 48 }}>
      <Cell label="Top"><MenuStage placement="top" /></Cell>
      <Cell label="Bottom"><MenuStage placement="bottom" /></Cell>
      <Cell label="Right"><MenuStage placement="right" /></Cell>
      <Cell label="Left"><MenuStage placement="left" /></Cell>
    </div>
  ),
}

/** `affix`: pinned to the bottom-right corner of the viewport, as used on a page. */
export const Affixed: Story = {
  render: () => (
    <div style={{ minHeight: 320, padding: 16 }}>
      <p style={{ margin: 0, color: 'var(--fc-color-content-description)' }}>Nút trợ giúp được ghim ở góc dưới bên phải màn hình.</p>
      <FloatButton affix aria-label="Trợ giúp" icon={<HelpCircle />} tooltip="Trợ giúp" />
    </div>
  ),
}
