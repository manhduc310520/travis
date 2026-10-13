import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '../Button/Button'
import { Popover } from '../Popover/Popover'
import { QRCode } from './QRCode'

const MENU_URL = 'https://fabi.vn/menu/ban-12'

const meta: Meta<typeof QRCode> = {
  title: 'Components/Data Display/QRCode',
  component: QRCode,
  args: {
    value: MENU_URL,
    'aria-label': 'Mã QR gọi món bàn 12',
  },
  argTypes: {
    value: { control: 'text' },
    size: { control: 'number' },
    bordered: { control: 'boolean' },
    status: { control: 'select', options: ['active', 'loading', 'expired', 'scanned'] },
    errorLevel: { control: 'select', options: ['L', 'M', 'Q', 'H'] },
    icon: { control: false },
    onRefresh: { control: false },
  },
}
export default meta
type Story = StoryObj<typeof QRCode>

/** Figma `QR Code`, `Type=Basic`: 160 × 160, hairline frame, table ordering link. */
export const Default: Story = {}

/**
 * Figma `Type=Popover`: the usual "scan on your phone" pattern. Figma draws a
 * 160 × 160 Color/Background/Elevated panel, padding 12, Radius/LG, with the
 * 16 × 8 arrow. Here the fc Popover gives the panel, arrow and padding
 * (Component/Popover/Padding = 12), so the code is borderless, 136px and on the
 * Elevated colour. Open on load; press the button to close and reopen.
 */
export const InPopover: Story = {
  render: (args) => (
    <div>
      <Popover
        defaultOpen
        placement="bottom"
        aria-label="Mã QR gọi món bàn 12"
        content={
          <QRCode {...args} bordered={false} size={136} bgColor="var(--fc-color-background-elevated)" />
        }
      >
        <Button>Quét mã gọi món</Button>
      </Popover>
    </div>
  ),
}

/** Figma `Type=Loading`: the fc Spin over the masked code while a new code is issued. */
export const Loading: Story = { args: { status: 'loading' } }

/**
 * Figma `Type=Expired`: text and a link Button "Làm mới" (Refresh) over the
 * masked code. `onRefresh` is logged in Actions; without it there is no action.
 */
export const Expired: Story = { args: { status: 'expired', onRefresh: fn() } }

/** Code-only state (no Figma variant): the customer has scanned the payment code. */
export const Scanned: Story = {
  args: { status: 'scanned', value: 'FABI|HD-000123|125.000', 'aria-label': 'Mã QR thanh toán hóa đơn HD-000123, 125.000 ₫' },
}

/** Brand mark in the centre (inline SVG, no network). Uses `errorLevel="H"` so the covered modules are recovered. */
export const WithIcon: Story = {
  args: {
    errorLevel: 'H',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="4" fill="var(--fc-color-solid-accent)" />
        <path d="M8 6h8v3h-5v2h4v3h-4v4H8z" fill="var(--fc-color-content-on-solid)" />
      </svg>
    ),
  },
}

/** `bordered={false}`: no frame or padding, for a surface that already frames the code (receipt, card). */
export const Borderless: Story = { args: { bordered: false } }

/** `size` and `color`: a small code for a table list and a large one for printing at the counter. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--fc-space-margin-lg)', alignItems: 'center' }}>
      <QRCode {...args} size={96} aria-label="Mã QR bàn 12, cỡ nhỏ" />
      <QRCode {...args} size={160} aria-label="Mã QR bàn 12, cỡ vừa" />
      <QRCode {...args} size={240} color="var(--fc-color-content-accent)" aria-label="Mã QR bàn 12, cỡ lớn" />
    </div>
  ),
}
