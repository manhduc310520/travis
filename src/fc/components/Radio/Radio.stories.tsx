import type { Meta, StoryObj } from '@storybook/react-vite'
import { Radio, RadioGroup } from './Radio'

const meta = {
  title: 'Components/Radio',
  component: RadioGroup,
  args: { label: 'Hình thức phục vụ', defaultValue: 'tai-quan', isDisabled: false, isInvalid: false, orientation: 'horizontal' },
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="tai-quan">Tại quán</Radio>
      <Radio value="mang-ve">Mang về</Radio>
      <Radio value="giao-hang">Giao hàng</Radio>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Vertical: Story = { args: { orientation: 'vertical' } }

export const WithHelp: Story = {
  args: { label: 'Chu kỳ báo cáo', defaultValue: 'tuan', description: 'Báo cáo gửi vào 8:00 sáng.' },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="ngay">Hằng ngày</Radio>
      <Radio value="tuan">Hằng tuần</Radio>
      <Radio value="thang">Hằng tháng</Radio>
    </RadioGroup>
  ),
}

export const Invalid: Story = {
  args: { label: 'Loại thuế', defaultValue: undefined, isInvalid: true, errorMessage: 'Chọn loại thuế áp dụng.' },
}

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-lg)' }}>
      <RadioGroup label="Cả nhóm không khả dụng" defaultValue="a" isDisabled>
        <Radio value="a">Đã chọn</Radio>
        <Radio value="b">Chưa chọn</Radio>
      </RadioGroup>
      <RadioGroup label="Một lựa chọn không khả dụng" defaultValue="a">
        <Radio value="a">Tiêu chuẩn</Radio>
        <Radio value="b" isDisabled>Cao cấp (sắp có)</Radio>
      </RadioGroup>
    </div>
  ),
}

/** Figma Label=false — the circle alone, named for assistive tech. */
export const WithoutLabel: Story = {
  render: () => (
    <RadioGroup aria-label="Chọn bàn" defaultValue="b2">
      <Radio value="b1" aria-label="Bàn 1" />
      <Radio value="b2" aria-label="Bàn 2" />
      <Radio value="b3" aria-label="Bàn 3" />
    </RadioGroup>
  ),
}

/** Figma "Radio / Radio Button": outlined and solid, three sizes, block, disabled option. */
export const ButtonStyle: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-base)', maxWidth: 480 }}>
      <RadioGroup appearance="button" aria-label="Khu vực" defaultValue="trong-nha">
        <Radio value="trong-nha">Trong nhà</Radio>
        <Radio value="san-vuon">Sân vườn</Radio>
        <Radio value="san-thuong">Sân thượng</Radio>
      </RadioGroup>
      <RadioGroup appearance="button" buttonStyle="solid" aria-label="Khu vực" defaultValue="san-vuon">
        <Radio value="trong-nha">Trong nhà</Radio>
        <Radio value="san-vuon">Sân vườn</Radio>
        <Radio value="san-thuong">Sân thượng</Radio>
      </RadioGroup>
      <RadioGroup appearance="button" size="sm" aria-label="Kỳ báo cáo" defaultValue="tuan">
        <Radio value="ngay">Ngày</Radio>
        <Radio value="tuan">Tuần</Radio>
        <Radio value="thang">Tháng</Radio>
      </RadioGroup>
      <RadioGroup appearance="button" size="lg" aria-label="Kỳ báo cáo" defaultValue="thang">
        <Radio value="ngay">Ngày</Radio>
        <Radio value="tuan">Tuần</Radio>
        <Radio value="thang">Tháng</Radio>
      </RadioGroup>
      <RadioGroup appearance="button" block aria-label="Hình thức" defaultValue="mang-ve">
        <Radio value="tai-quan">Tại quán</Radio>
        <Radio value="mang-ve">Mang về</Radio>
        <Radio value="giao-hang">Giao hàng</Radio>
      </RadioGroup>
      <RadioGroup appearance="button" aria-label="Gói dịch vụ" defaultValue="co-ban">
        <Radio value="co-ban">Cơ bản</Radio>
        <Radio value="nang-cao">Nâng cao</Radio>
        <Radio value="doanh-nghiep" isDisabled>Doanh nghiệp</Radio>
      </RadioGroup>
    </div>
  ),
}
