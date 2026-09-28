import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Printer } from '../../../icons'
import { Button } from '../Button/Button'
import { Alert, type AlertType } from './Alert'

const meta = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  args: {
    type: 'info',
    title: 'Thực đơn mới sẽ áp dụng từ 06:00 ngày mai.',
    showIcon: true,
    banner: false,
    closable: false,
  },
  argTypes: {
    type: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    title: { control: 'text' },
    description: { control: 'text' },
    closeText: { control: 'text' },
    icon: { control: false },
    action: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 640 }}><Story /></div>],
} satisfies Meta<typeof Alert>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'flex', flexDirection: 'column', gap: 'var(--fc-space-margin-base)' } as const
const caption = { color: 'var(--fc-color-content-description)', fontSize: 'var(--fc-typography-size-sm)' } as const

const COPY: Record<AlertType, { title: string; description: string }> = {
  success: { title: 'Đã chốt ca thành công', description: 'Báo cáo ca sáng đã được gửi tới quản lý chi nhánh Quận 1.' },
  info: { title: 'Thực đơn mới sẽ áp dụng từ 06:00 ngày mai', description: 'Giá mới của 12 món được đồng bộ tới mọi máy POS trong chuỗi.' },
  warning: { title: 'Máy in bếp sắp hết giấy', description: 'Còn khoảng 20 phiếu. Thay cuộn giấy trước giờ cao điểm trưa.' },
  error: { title: 'Không thể kết nối máy in bếp', description: 'Phiếu của bàn 12 chưa được in. Kiểm tra cáp mạng rồi thử lại.' },
}
const TYPES: AlertType[] = ['success', 'info', 'warning', 'error']

/** Figma "❖ Alert"; set Type, Banner, description and close in the controls. */
export const Playground: Story = {}

/** Figma Type = Success, Info, Warning, Error × Description=False, with the close icon. */
export const Types: Story = {
  render: () => (
    <div style={stack}>
      {TYPES.map((t) => <Alert key={t} type={t} title={COPY[t].title} closable />)}
    </div>
  ),
}

/** Figma Description=True: 24px icon, 16px title, padding 20 × 24. */
export const WithDescription: Story = {
  render: () => (
    <div style={stack}>
      {TYPES.map((t) => <Alert key={t} type={t} title={COPY[t].title} description={COPY[t].description} closable />)}
    </div>
  ),
}

/** `showIcon={false}` — the Figma "Info Text" example has no icon. */
export const WithoutIcon: Story = {
  args: {
    type: 'info',
    showIcon: false,
    title: COPY.info.title,
    description: COPY.info.description,
  },
}

/** Figma Banner=False (rounded, bordered) next to Banner=True (flush: no border, no radius). */
export const Banner: Story = {
  render: () => (
    <div style={stack}>
      <div style={caption}>Banner=False</div>
      <Alert type="warning" title={COPY.warning.title} />
      <div style={caption}>Banner=True</div>
      <Alert banner type="warning" title={COPY.warning.title} closable />
      <Alert banner type="error" title="Mất kết nối máy chủ. Đơn mới được lưu tạm trên máy." closable />
    </div>
  ),
}

/**
 * Figma "Custom Actions": a single text action ("Hoàn tác", the Undo pattern) and a
 * stacked pair on an alert with description — one primary, the other default.
 */
export const CustomActions: Story = {
  render: () => (
    <div style={stack}>
      <Alert type="success" title="Đã xóa món Trà đào khỏi thực đơn" closable action={<Button size="sm" variant="text">Hoàn tác</Button>} />
      <Alert
        type="info"
        showIcon={false}
        title="Yêu cầu đổi ca từ Nguyễn Văn An"
        description="Đổi ca sáng thứ Bảy 28/09 sang ca chiều cùng ngày."
        closable
        action={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fc-space-margin-xxs)' }}>
            <Button size="sm" variant="primary">Chấp nhận</Button>
            <Button size="sm" danger>Từ chối</Button>
          </div>
        }
      />
      <Alert type="error" title={COPY.error.title} action={<Button size="sm" danger iconStart={<Printer />}>In lại</Button>} closable />
    </div>
  ),
}

/** Figma "Close Text" (text button) and "Close Icon" (× button). */
export const CloseTextAndIcon: Story = {
  render: () => (
    <div style={stack}>
      <Alert type="info" title="Đã có bản cập nhật POS 4.2" closeText="Đã hiểu" />
      <Alert type="info" title="Đã có bản cập nhật POS 4.2" closable />
    </div>
  ),
}

function ClosableDemo() {
  const [key, setKey] = useState(0)
  const [closed, setClosed] = useState(false)
  return (
    <div style={stack}>
      <Alert
        key={key}
        type="warning"
        title={COPY.warning.title}
        description={COPY.warning.description}
        closable
        afterClose={() => setClosed(true)}
      />
      <Alert type="info" title="Nội dung phía dưới trượt lên khi cảnh báo đóng." />
      {closed && (
        <div>
          <Button onPress={() => { setClosed(false); setKey((k) => k + 1) }}>Hiện lại cảnh báo</Button>
        </div>
      )}
    </div>
  )
}

/** Press × to close: the alert fades and collapses (instantly under reduced motion), then unmounts. */
export const Closable: Story = {
  render: () => <ClosableDemo />,
}
