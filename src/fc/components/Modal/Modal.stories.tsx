import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Printer } from '../../../icons'
import { Button } from '../Button/Button'
import { Flex } from '../Flex/Flex'
import { TextField, TextArea } from '../Input/Input'
import { Tag } from '../Tag/Tag'
import { ConfirmModal, InfoModal, Modal, ModalTrigger, type ModalStatus } from './Modal'
import { useModal } from './useModal'

const meta = {
  title: 'Components/Modal',
  component: Modal,
  args: {
    title: 'Thông tin đơn hàng',
    children: 'Đơn #HD-10245 của bàn 12 đã được gửi xuống bếp lúc 12:30. Bạn có muốn in phiếu tạm tính cho khách không?',
    okText: 'Đồng ý',
    cancelText: 'Hủy',
    closable: true,
    isDismissable: true,
    danger: false,
    confirmLoading: false,
  },
  argTypes: {
    width: { control: 'number' },
    footer: { control: false },
    children: { control: 'text' },
  },
  parameters: {
    // Each story in its own iframe on the Docs page, so open modals and their
    // masks stay inside their own preview instead of covering the page.
    docs: { story: { inline: false, iframeHeight: 520 } },
  },
  render: (args) => (
    <ModalTrigger>
      <Button>Mở hộp thoại</Button>
      <Modal {...args} />
    </ModalTrigger>
  ),
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/** Interactive: press the button. Esc, the close icon, "Hủy" or the mask close it. */
export const Playground: Story = {}

/** Figma `Modal / Basic` Type=Text — open on load. */
export const Basic: Story = {
  render: (args) => (
    <ModalTrigger defaultOpen>
      <Button>Mở lại</Button>
      <Modal {...args} />
    </ModalTrigger>
  ),
}

/** Figma `Modal / Basic` Type=Slot — any content in the body, here a form. */
export const Slot: Story = {
  render: () => (
    <ModalTrigger defaultOpen>
      <Button>Mở lại</Button>
      <Modal title="Thêm món ăn" okText="Lưu món">
        <Flex direction="column" gap="base">
          <TextField label="Tên món" placeholder="Ví dụ: Phở bò tái" isRequired />
          <TextField label="Giá bán" placeholder="0" suffix="₫" inputMode="numeric" />
          <TextArea label="Mô tả" placeholder="Thành phần, khẩu vị…" rows={3} />
        </Flex>
      </Modal>
    </ModalTrigger>
  ),
}

const orderLines = [
  ['Phở bò tái', '2 × 65.000 ₫'],
  ['Gỏi cuốn tôm thịt', '1 × 45.000 ₫'],
  ['Trà đá', '3 × 5.000 ₫'],
] as const

/** Custom footer: a function receives `close`. One primary action only. */
export const CustomFooter: Story = {
  render: () => (
    <ModalTrigger defaultOpen>
      <Button>Mở lại</Button>
      <Modal
        title="Thông tin đơn hàng"
        footer={(close) => (
          <>
            <Button iconStart={<Printer />} onPress={close}>In tạm tính</Button>
            <Button onPress={close}>Đóng</Button>
            <Button variant="primary" onPress={close}>Thanh toán</Button>
          </>
        )}
      >
        <Flex direction="column" gap="xs">
          <Flex justify="between" align="center">
            <span>Bàn 12 · Đơn #HD-10245</span>
            <Tag color="info">Đang phục vụ</Tag>
          </Flex>
          {orderLines.map(([name, qty]) => (
            <Flex key={name} justify="between">
              <span>{name}</span>
              <span>{qty}</span>
            </Flex>
          ))}
        </Flex>
      </Modal>
    </ModalTrigger>
  ),
}

/** `footer={null}`: read-only content, closed with the icon or Esc. */
export const WithoutFooter: Story = {
  render: () => (
    <ModalTrigger defaultOpen>
      <Button>Mở lại</Button>
      <Modal title="Giờ mở cửa" footer={null}>
        Thứ Hai – Thứ Sáu: 07:00 – 22:00. Thứ Bảy, Chủ Nhật: 06:30 – 23:00.
      </Modal>
    </ModalTrigger>
  ),
}

const STATUS_COPY: Record<ModalStatus, { title: string; content: string }> = {
  info: { title: 'Cập nhật thực đơn', content: 'Thực đơn mới sẽ áp dụng cho tất cả chi nhánh từ 01/10/2026.' },
  success: { title: 'Đã lưu món ăn', content: "Món 'Phở bò' đã được thêm vào thực đơn." },
  warning: { title: 'Sắp hết nguyên liệu', content: 'Bò tái chỉ còn đủ cho khoảng 5 phần. Hãy nhập thêm hàng.' },
  error: { title: 'Không thể in hóa đơn', content: 'Máy in quầy thu ngân không phản hồi. Kiểm tra kết nối rồi thử lại.' },
}

const statusStory = (status: ModalStatus): Story => ({
  render: () => (
    <ModalTrigger defaultOpen>
      <Button>Mở lại</Button>
      <InfoModal status={status} title={STATUS_COPY[status].title}>{STATUS_COPY[status].content}</InfoModal>
    </ModalTrigger>
  ),
})

/** Figma `Modal / Information` Status=Info. */
export const InformationInfo = statusStory('info')
/** Figma `Modal / Information` Status=Success. */
export const InformationSuccess = statusStory('success')
/** Figma `Modal / Information` Status=Warning. */
export const InformationWarning = statusStory('warning')
/** Figma `Modal / Information` Status=Error. */
export const InformationError = statusStory('error')

/** Figma `Modal / Information`, all four statuses — interactive. */
export const InformationTriggers: Story = {
  render: () => (
    <Flex gap="xs" wrap>
      {(['info', 'success', 'warning', 'error'] as const).map((status) => (
        <ModalTrigger key={status}>
          <Button>{STATUS_COPY[status].title}</Button>
          <InfoModal status={status} title={STATUS_COPY[status].title}>{STATUS_COPY[status].content}</InfoModal>
        </ModalTrigger>
      ))}
    </Flex>
  ),
}

/** Figma confirmation example, destructive: OK is danger, focus starts on "Hủy". */
export const Confirmation: Story = {
  render: () => (
    <ModalTrigger defaultOpen>
      <Button danger>Xóa món</Button>
      <ConfirmModal title="Xóa món ăn?" okText="Xóa" danger onOk={() => sleep(800)}>
        Món 'Phở bò' sẽ bị xóa khỏi thực đơn.
      </ConfirmModal>
    </ModalTrigger>
  ),
}

/** Figma "with overlay": the Background/Overlay mask dims the page behind. */
export const WithOverlay: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ minHeight: '100vh', padding: 'var(--fc-space-padding-lg)', background: 'var(--fc-color-background-layout)' }}>
      <Flex direction="column" gap="sm">
        {['Bàn 1 · 2 khách · 245.000 ₫', 'Bàn 4 · 4 khách · 780.000 ₫', 'Bàn 12 · 3 khách · 190.000 ₫'].map((row) => (
          <div key={row} style={{ padding: 'var(--fc-space-padding-base)', borderRadius: 'var(--fc-radius-lg)', background: 'var(--fc-color-background-container)' }}>
            {row}
          </div>
        ))}
        <ModalTrigger defaultOpen>
          <Button>Mở lại</Button>
          <Modal title="Gộp bàn" okText="Gộp bàn">Gộp bàn 4 vào bàn 12? Hai đơn sẽ tính chung một hóa đơn.</Modal>
        </ModalTrigger>
      </Flex>
    </div>
  ),
}

/**
 * Imperative `useModal()`: `await modal.confirm({…})` resolves `true` after
 * OK (here after an 800 ms save) or `false` when cancelled.
 */
export const UseModal: Story = {
  render: function UseModalDemo() {
    const [modal, contextHolder] = useModal()
    const [result, setResult] = useState('Chưa có thao tác')

    const remove = async () => {
      const confirmed = await modal.confirm({
        title: 'Xóa món ăn?',
        content: "Món 'Phở bò' sẽ bị xóa khỏi thực đơn.",
        okText: 'Xóa',
        danger: true,
        onOk: () => sleep(800),
      })
      setResult(confirmed ? 'Đã xóa món' : 'Đã hủy')
    }

    return (
      <Flex direction="column" gap="base" align="start">
        <Flex gap="xs" wrap>
          <Button danger onPress={remove}>Xóa món</Button>
          <Button onPress={() => modal.info(STATUS_COPY.info)}>Thông tin</Button>
          <Button onPress={() => modal.success(STATUS_COPY.success)}>Thành công</Button>
          <Button onPress={() => modal.warning(STATUS_COPY.warning)}>Cảnh báo</Button>
          <Button onPress={() => modal.error(STATUS_COPY.error)}>Lỗi</Button>
        </Flex>
        <span role="status">Kết quả: {result}</span>
        {contextHolder}
      </Flex>
    )
  },
}

/** Controlled with `isOpen` / `onOpenChange`; `onOk` returns a promise, so OK shows pending. */
export const Controlled: Story = {
  render: function ControlledDemo() {
    const [isOpen, setOpen] = useState(false)
    const [saved, setSaved] = useState(0)
    return (
      <Flex gap="base" align="center">
        <Button onPress={() => setOpen(true)}>Đổi tên khu vực</Button>
        <span role="status">Đã lưu {saved} lần</span>
        <Modal
          title="Đổi tên khu vực"
          okText="Lưu"
          isOpen={isOpen}
          onOpenChange={setOpen}
          onOk={async () => {
            await sleep(1000)
            setSaved((n) => n + 1)
          }}
        >
          <TextField label="Tên khu vực" defaultValue="Tầng 2 – Sân thượng" />
        </Modal>
      </Flex>
    )
  },
}

const paragraphs = Array.from({ length: 16 }, (_, i) => `Điều ${i + 1}. Nhân viên phục vụ kiểm tra lại món, số lượng và ghi chú của khách trước khi gửi đơn xuống bếp; đơn đã gửi chỉ được hủy khi quản lý ca xác nhận.`)

/** Long content: the body scrolls, header and footer stay in view. */
export const LongContent: Story = {
  render: () => (
    <ModalTrigger defaultOpen>
      <Button>Mở lại</Button>
      <Modal title="Quy định phục vụ" okText="Đã đọc">
        <Flex direction="column" gap="xs">
          {paragraphs.map((p) => <p key={p} style={{ margin: 0 }}>{p}</p>)}
        </Flex>
      </Modal>
    </ModalTrigger>
  ),
}
