import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button/Button'
import { Flex } from '../Flex/Flex'
import { TextArea, TextField } from '../Input/Input'
import { Tag } from '../Tag/Tag'
import { Drawer, DrawerTrigger, type DrawerPlacement } from './Drawer'

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  args: {
    title: 'Chi tiết đơn hàng',
    placement: 'right',
    closable: true,
    isDismissable: true,
    size: 'default',
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['right', 'left', 'top', 'bottom'] },
    size: { control: 'inline-radio', options: ['default', 'large'] },
    width: { control: 'number' },
    height: { control: 'number' },
    extra: { control: false },
    footer: { control: false },
    children: { control: false },
  },
  parameters: {
    // Each story in its own iframe on the Docs page, so open drawers and their
    // masks stay inside their own preview instead of covering the page.
    docs: { story: { inline: false, iframeHeight: 560 } },
  },
  render: (args) => (
    <DrawerTrigger>
      <Button>Xem đơn hàng</Button>
      <Drawer {...args}>
        <OrderDetail />
      </Drawer>
    </DrawerTrigger>
  ),
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

const lines = [
  ['Phở bò tái', '2 × 65.000 ₫'],
  ['Gỏi cuốn tôm thịt', '1 × 45.000 ₫'],
  ['Cà phê sữa đá', '2 × 29.000 ₫'],
  ['Trà đá', '3 × 5.000 ₫'],
] as const

function OrderDetail() {
  return (
    <Flex direction="column" gap="sm">
      <Flex justify="between" align="center">
        <span>Bàn 12 · Đơn #HD-10245</span>
        <Tag color="info">Đang phục vụ</Tag>
      </Flex>
      {lines.map(([name, qty]) => (
        <Flex key={name} justify="between">
          <span>{name}</span>
          <span>{qty}</span>
        </Flex>
      ))}
      <Flex justify="between">
        <span>Tạm tính</span>
        <span>293.000 ₫</span>
      </Flex>
    </Flex>
  )
}

/** Interactive: press the button. Esc, the close icon or the mask close it. */
export const Playground: Story = {}

const PLACEMENT_LABEL: Record<DrawerPlacement, string> = { right: 'Phải', left: 'Trái', top: 'Trên', bottom: 'Dưới' }

const placementStory = (placement: DrawerPlacement): Story => ({
  args: { placement },
  render: (args) => (
    <DrawerTrigger defaultOpen>
      <Button>Mở lại</Button>
      <Drawer {...args} placement={placement}>
        <OrderDetail />
      </Drawer>
    </DrawerTrigger>
  ),
})

/** Figma Placement=Right (default) — open on load. */
export const Right = placementStory('right')
/** Figma Placement=Left. */
export const Left = placementStory('left')
/** Figma Placement=Top: full width, 400 tall. */
export const Top = placementStory('top')
/** Figma Placement=Bottom: full width, 400 tall. */
export const Bottom = placementStory('bottom')

/** All four placements — interactive. */
export const Placements: Story = {
  render: () => (
    <Flex gap="xs" wrap>
      {(['right', 'left', 'top', 'bottom'] as const).map((placement) => (
        <DrawerTrigger key={placement}>
          <Button>{PLACEMENT_LABEL[placement]}</Button>
          <Drawer placement={placement} title="Chi tiết đơn hàng">
            <OrderDetail />
          </Drawer>
        </DrawerTrigger>
      ))}
    </Flex>
  ),
}

/**
 * Figma "Button Outline?" + "Button Primary?": header actions. The primary
 * lives here, so there is no footer (one primary per surface).
 */
export const ExtraActions: Story = {
  render: () => (
    <DrawerTrigger defaultOpen>
      <Button>Mở lại</Button>
      <Drawer
        title="Sửa món ăn"
        extra={(
          <>
            <Button slot="close">Hủy</Button>
            <Button variant="primary" slot="close">Lưu</Button>
          </>
        )}
      >
        <Flex direction="column" gap="base">
          <TextField label="Tên món" defaultValue="Phở bò tái" />
          <TextField label="Giá bán" defaultValue="65.000" suffix="₫" inputMode="numeric" />
          <TextArea label="Ghi chú cho bếp" placeholder="Ví dụ: ít hành" rows={3} />
        </Flex>
      </Drawer>
    </DrawerTrigger>
  ),
}

/** Figma "Footer?": actions under the body. */
export const WithFooter: Story = {
  render: () => (
    <DrawerTrigger defaultOpen>
      <Button>Mở lại</Button>
      <Drawer
        title="Chi tiết đơn hàng"
        footer={(
          <>
            <Button slot="close">Đóng</Button>
            <Button variant="primary" slot="close">Thanh toán</Button>
          </>
        )}
      >
        <OrderDetail />
      </Drawer>
    </DrawerTrigger>
  ),
}

/** Figma "Close Icon?" off: closes with Esc, the mask or the footer button. */
export const WithoutCloseIcon: Story = {
  render: () => (
    <DrawerTrigger defaultOpen>
      <Button>Mở lại</Button>
      <Drawer title="Chi tiết đơn hàng" closable={false} footer={<Button slot="close">Đóng</Button>}>
        <OrderDetail />
      </Drawer>
    </DrawerTrigger>
  ),
}

/** `size="large"`: 736 wide. */
export const Large: Story = {
  render: () => (
    <DrawerTrigger defaultOpen>
      <Button>Mở lại</Button>
      <Drawer title="Chi tiết đơn hàng" size="large">
        <OrderDetail />
      </Drawer>
    </DrawerTrigger>
  ),
}

const rules = Array.from({ length: 24 }, (_, i) => `Bước ${i + 1}. Kiểm tra món, số lượng và ghi chú của khách trước khi gửi đơn xuống bếp.`)

/** Long content: the body scrolls between a fixed header and footer. */
export const LongContent: Story = {
  render: () => (
    <DrawerTrigger defaultOpen>
      <Button>Mở lại</Button>
      <Drawer title="Quy trình phục vụ" footer={<Button slot="close">Đóng</Button>}>
        <Flex direction="column" gap="xs">
          {rules.map((r) => <p key={r} style={{ margin: 0 }}>{r}</p>)}
        </Flex>
      </Drawer>
    </DrawerTrigger>
  ),
}

/** Controlled with `isOpen` / `onOpenChange`. */
export const Controlled: Story = {
  render: function ControlledDemo() {
    const [isOpen, setOpen] = useState(false)
    return (
      <Flex gap="base" align="center">
        <Button onPress={() => setOpen(true)}>Xem đơn hàng</Button>
        <span role="status">{isOpen ? 'Đang mở' : 'Đang đóng'}</span>
        <Drawer title="Chi tiết đơn hàng" isOpen={isOpen} onOpenChange={setOpen}>
          <OrderDetail />
        </Drawer>
      </Flex>
    )
  },
}
