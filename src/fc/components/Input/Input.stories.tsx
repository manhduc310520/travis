import type { Meta, StoryObj } from '@storybook/react-vite'
import { Building02, Mail01, SearchMd, User01 } from '../../../icons'
import { TextArea, TextField } from './Input'
import { OtpField } from './OtpField'
import { SearchField } from './SearchField'

const meta = {
  title: 'Components/Input',
  component: TextField,
  args: {
    label: 'Tên nhà hàng',
    placeholder: 'Nhập tên nhà hàng',
    size: 'md',
    variant: 'outlined',
    isDisabled: false,
    isRequired: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outlined', 'filled', 'underlined', 'borderless'] },
    status: { control: 'inline-radio', options: [undefined, 'error', 'warning', 'success'] },
  },
} satisfies Meta<typeof TextField>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--fc-space-margin-base)', maxWidth: 360 } as const

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={stack}>
      <TextField size="sm" label="Nhỏ" placeholder="Nhập nội dung" />
      <TextField label="Chuẩn" placeholder="Nhập nội dung" />
      <TextField size="lg" label="Lớn" placeholder="Nhập nội dung" />
    </div>
  ),
}

/** Figma Input Item: Outlined, Filled, Underlined, Borderless. */
export const Variants: Story = {
  render: () => (
    <div style={stack}>
      <TextField label="Outlined — viền" placeholder="Nhập nội dung" />
      <TextField variant="filled" label="Filled — nền" placeholder="Nhập nội dung" />
      <TextField variant="underlined" label="Underlined — gạch dưới" placeholder="Nhập nội dung" />
      <TextField variant="borderless" label="Borderless — không viền" placeholder="Nhập nội dung" />
    </div>
  ),
}

/** Figma Status: Error, Warning, Success — outlined and filled. */
export const Status: Story = {
  render: () => (
    <div style={{ ...stack, gridTemplateColumns: '1fr 1fr', maxWidth: 720 }}>
      <TextField label="Lỗi" status="error" defaultValue="0901" errorMessage="Số điện thoại cần đủ 10 chữ số." />
      <TextField variant="filled" label="Lỗi" status="error" defaultValue="0901" errorMessage="Số điện thoại cần đủ 10 chữ số." />
      <TextField label="Cảnh báo" status="warning" defaultValue="TET2026" description="Mã này sắp hết hạn." />
      <TextField variant="filled" label="Cảnh báo" status="warning" defaultValue="TET2026" description="Mã này sắp hết hạn." />
      <TextField label="Hợp lệ" status="success" defaultValue="HCM-Q1" description="Mã chi nhánh hợp lệ." />
      <TextField variant="underlined" label="Hợp lệ" status="success" defaultValue="HCM-Q1" />
    </div>
  ),
}

/** Figma "Show Count" — input and textarea. */
export const ShowCount: Story = {
  render: () => (
    <div style={stack}>
      <TextField label="Tên món" showCount maxLength={40} defaultValue="Phở bò tái" />
      <TextField label="Mã giảm giá" showCount size="lg" maxLength={12} />
      <TextArea label="Ghi chú cho bếp" showCount maxLength={200} defaultValue="Ít cay, không hành." />
    </div>
  ),
}

/** Figma "Pre Post Tab": text or icon joined to the field — both, before only, after only, three sizes. */
export const PrePostTab: Story = {
  render: () => (
    <div style={stack}>
      <TextField aria-label="Tên miền" addonBefore="https://" addonAfter=".vn" defaultValue="phoco" />
      <TextField aria-label="Tên miền" addonBefore="https://" defaultValue="phoco.vn" />
      <TextField aria-label="Email công ty" addonAfter="@fabi.vn" defaultValue="lien.nguyen" />
      <TextField aria-label="Chi nhánh" addonBefore={<Building02 />} placeholder="Tên chi nhánh" />
      <TextField aria-label="Hộp thư" addonAfter={<Mail01 />} placeholder="Địa chỉ email" />
      <TextField size="sm" aria-label="Giá" addonBefore="₫" addonAfter="/ phần" defaultValue="45.000" />
      <TextField size="lg" aria-label="Giá" addonBefore="₫" addonAfter="/ phần" defaultValue="45.000" />
    </div>
  ),
}

/** Figma "Input / Search": icon only, default button, primary icon button, primary text button. */
export const Search: Story = {
  render: () => (
    <div style={stack}>
      <SearchField aria-label="Tìm kiếm" placeholder="Tìm nhà hàng, món ăn" />
      <SearchField aria-label="Tìm kiếm" placeholder="Tìm nhà hàng" button="default" />
      <SearchField aria-label="Tìm kiếm" placeholder="Tìm nhà hàng" button="primary" />
      <SearchField aria-label="Tìm kiếm" placeholder="Tìm nhà hàng" button="primary" buttonText="Tìm" />
      <SearchField aria-label="Tìm kiếm" placeholder="Nhỏ" size="sm" button="primary" />
      <SearchField aria-label="Tìm kiếm" placeholder="Lớn" size="lg" button="primary" buttonText="Tìm kiếm" />
      <SearchField aria-label="Tìm kiếm" placeholder="Nền" variant="filled" />
    </div>
  ),
}

/** Figma "Input / OTP": 4, 6 and 8 cells, separator, status, filled and borderless, sizes. */
export const Otp: Story = {
  render: () => (
    <div style={{ ...stack, maxWidth: 520 }}>
      <OtpField label="Mã xác thực (4)" length={4} />
      <OtpField label="Mã xác thực (6)" length={6} defaultValue="4821" />
      <OtpField label="Mã xác thực (8)" length={8} />
      <OtpField label="Có dấu phân cách" length={6} separator="-" />
      <OtpField label="Mã sai" length={6} defaultValue="123456" status="error" errorMessage="Mã không đúng, thử lại." />
      <OtpField label="Sắp hết hạn" length={6} status="warning" description="Mã hết hạn sau 30 giây." />
      <OtpField label="Nền" length={6} variant="filled" />
      <OtpField label="Không viền" length={6} variant="borderless" />
      <OtpField label="Nhỏ" length={6} size="sm" />
      <OtpField label="Lớn" length={6} size="lg" />
      <OtpField label="Không khả dụng" length={6} defaultValue="000000" isDisabled />
    </div>
  ),
}

export const WithAffixes: Story = {
  render: () => (
    <div style={stack}>
      <TextField aria-label="Tìm kiếm" placeholder="Tìm nhà hàng, món ăn" prefix={<SearchMd />} />
      <TextField label="Người phụ trách" placeholder="Họ và tên" prefix={<User01 />} />
      <TextField label="Giá bán" placeholder="0" suffix="VNĐ" inputMode="numeric" />
      <TextField label="Mật khẩu" type="password" revealable defaultValue="matkhau123" />
    </div>
  ),
}

export const HelpAndValidation: Story = {
  render: () => (
    <div style={stack}>
      <TextField label="Email" isRequired description="Dùng để nhận hóa đơn điện tử." placeholder="ten@congty.vn" />
      <TextField label="Số điện thoại" status="error" defaultValue="0901" errorMessage="Số điện thoại cần đủ 10 chữ số." />
      <TextField label="Mã giảm giá" status="warning" defaultValue="TET2026" description="Mã này sắp hết hạn." />
      <TextField
        label="Mã chi nhánh"
        isRequired
        description="Gồm 3 chữ cái in hoa, ví dụ HCM."
        validate={(v) => (/^[A-Z]{3}$/.test(v) ? null : 'Mã chi nhánh gồm đúng 3 chữ cái in hoa.')}
        validationBehavior="aria"
        defaultValue="hn"
      />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div style={stack}>
      <TextField label="Mã nhà hàng" isDisabled defaultValue="NH-0012" />
      <TextField variant="filled" label="Mã nhà hàng" isDisabled defaultValue="NH-0012" />
    </div>
  ),
}

export const MultiLine: Story = {
  render: () => (
    <div style={stack}>
      <TextArea label="Ghi chú" placeholder="Ghi chú cho bếp" description="Tối đa 200 ký tự." />
      <TextArea label="Địa chỉ" variant="filled" rows={2} defaultValue="12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh" />
      <TextArea label="Lý do hủy" status="error" errorMessage="Vui lòng nhập lý do hủy." />
    </div>
  ),
}
