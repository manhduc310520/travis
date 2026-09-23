import type { Meta, StoryObj } from '@storybook/react-vite'
import { QRCode } from 'antd'

const meta: Meta<typeof QRCode> = {
  component: QRCode,
  title: 'Components/QRCode',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on `value`/`size` in antd's qr-code types. `bordered`'s JSDoc
  // is about a different `bordered` prop (in a describes-image comment,
  // not this one) — not copied to avoid attributing the wrong text.
  argTypes: {
    value: { description: 'The text or URL encoded into the QR code.', control: 'text' },
    size: { description: 'Width and height of the QR code, in pixels.', control: 'number' },
    bordered: { description: 'Draws a border/padding around the QR code.', control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof QRCode>

export const Default: Story = { args: { value: 'https://ipos.vn' } }
export const WithIconSlot: Story = { args: { value: 'https://ipos.vn', size: 160, bordered: true } }
