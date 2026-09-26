import type { Meta, StoryObj } from '@storybook/react-vite'
import { FaceSmile, XCircle } from '../../../icons'
import { Button } from '../Button/Button'
import { Link } from '../Typography/Typography'
import { Result } from './Result'

const meta = {
  title: 'Components/Result',
  component: Result,
  args: { status: 'success' },
  argTypes: {
    status: { control: 'select', options: ['info', 'success', 'warning', 'error', '403', '404', '500'] },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    icon: { control: false },
    extra: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Result>
export default meta
type Story = StoryObj<typeof meta>

const actions = (primary: string, secondary?: string) => (
  <>
    <Button variant="primary">{primary}</Button>
    {secondary && <Button>{secondary}</Button>}
  </>
)

/** Figma "❖ Result"; pick Status in the controls. */
export const Playground: Story = {
  args: {
    title: 'Thanh toán thành công',
    subtitle: 'Hóa đơn #HD-20481 · Bàn 12 · 485.000đ. Phiếu đã gửi xuống bếp.',
    extra: actions('In hóa đơn', 'Tạo đơn mới'),
  },
}

/** Figma Status=Success. One primary action, the other default. */
export const Success: Story = {
  args: {
    status: 'success',
    title: 'Thanh toán thành công',
    subtitle: 'Hóa đơn #HD-20481 · Bàn 12 · 485.000đ. Phiếu đã gửi xuống bếp.',
    extra: actions('In hóa đơn', 'Tạo đơn mới'),
  },
}

/** Figma Status=Info (Figma draws `search-sm`). */
export const Info: Story = {
  args: {
    status: 'info',
    title: 'Đang đồng bộ thực đơn',
    subtitle: 'Thực đơn mới sẽ có trên máy POS của 3 chi nhánh sau vài phút.',
    extra: actions('Về trang thực đơn'),
  },
}

/** Figma Status=Warning (Figma draws `alert-triangle`). */
export const Warning: Story = {
  args: {
    status: 'warning',
    title: 'Ca làm việc chưa được chốt',
    subtitle: 'Còn 2 hóa đơn chưa thanh toán. Hoàn tất chúng trước khi chốt ca.',
    extra: actions('Xem hóa đơn', 'Để sau'),
  },
}

const itemRow = { display: 'flex', alignItems: 'flex-start', gap: 'var(--fc-space-margin-xs)' } as const
const itemIcon = { flex: 'none', marginBlockStart: 'var(--fc-space-margin-xxs)', color: 'var(--fc-color-content-danger)' } as const

/** Figma Status=Error with its "Error Details" slot (`children`). */
export const ErrorWithDetails: Story = {
  args: {
    status: 'error',
    title: 'Không thể lưu phiếu nhập kho',
    subtitle: 'Kiểm tra và sửa các mục dưới đây rồi gửi lại.',
    extra: actions('Sửa phiếu', 'Hủy'),
    children: (
      <div style={{ display: 'grid', gap: 'var(--fc-space-margin-sm)', color: 'var(--fc-color-content-heading)' }}>
        <div style={{ fontSize: 'var(--fc-typography-size-lg)', lineHeight: 'var(--fc-typography-line-height-lg)', fontWeight: 'var(--fc-typography-weight-semibold)' }}>
          Phiếu nhập có các lỗi sau:
        </div>
        <div style={itemRow}>
          <XCircle style={itemIcon} />
          <span>Nguyên liệu "Bò Úc" chưa có đơn vị tính. <Link href="#">Cập nhật nguyên liệu</Link></span>
        </div>
        <div style={itemRow}>
          <XCircle style={itemIcon} />
          <span>Kho "Chi nhánh Quận 1" đã khóa sổ tháng 09. <Link href="#">Mở khóa sổ</Link></span>
        </div>
      </div>
    ),
  },
}

/** Figma Status=403 — the Figma illustration, default title and subtitle. */
export const Forbidden: Story = {
  args: { status: '403', extra: actions('Về trang chủ') },
}

/** Figma Status=404. */
export const NotFound: Story = {
  args: { status: '404', extra: actions('Về trang chủ') },
}

/** Figma Status=500. */
export const ServerError: Story = {
  args: { status: '500', extra: actions('Thử lại', 'Về trang chủ') },
}

/** Figma Status=Custom icon: any node in `icon` (here `face-smile`, as in Figma). */
export const CustomIcon: Story = {
  args: {
    icon: <FaceSmile />,
    title: 'Đã hoàn tất cài đặt chi nhánh!',
    extra: actions('Bắt đầu bán hàng'),
  },
}
