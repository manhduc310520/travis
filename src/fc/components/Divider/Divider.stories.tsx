import type { Meta, StoryObj } from '@storybook/react-vite'
import { Paragraph, Text } from '../Typography/Typography'
import { Divider } from './Divider'

const text = 'Nhà hàng đang mở cửa từ 9:00 đến 22:00. Thực đơn được cập nhật mỗi tuần.'

const meta = {
  title: 'Components/Divider',
  component: Divider,
  args: { variant: 'solid', plain: false, titlePlacement: 'center' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'dashed', 'dotted'] },
    titlePlacement: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
} satisfies Meta<typeof Divider>
export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: (args) => (
    <div>
      <Paragraph>{text}</Paragraph>
      <Divider {...args} />
      <Paragraph>{text}</Paragraph>
    </div>
  ),
}

export const Dashed: Story = { ...Horizontal, args: { variant: 'dashed' } }

export const Dotted: Story = { ...Horizontal, args: { variant: 'dotted' } }

export const WithTitle: Story = {
  render: (args) => (
    <div>
      <Divider {...args} titlePlacement="start">Thông tin chung</Divider>
      <Paragraph>{text}</Paragraph>
      <Divider {...args}>Giờ mở cửa</Divider>
      <Paragraph>{text}</Paragraph>
      <Divider {...args} titlePlacement="end">Ghi chú</Divider>
    </div>
  ),
}

export const Plain: Story = { ...WithTitle, args: { plain: true } }

export const Vertical: Story = {
  render: () => (
    <Text>
      Đơn hàng<Divider orientation="vertical" />Khách hàng<Divider orientation="vertical" />Báo cáo
    </Text>
  ),
}

/** Figma Variant × Text Type: every line style with a plain and a title-style text. */
export const LineStyles: Story = {
  render: () => (
    <div>
      {(['solid', 'dashed', 'dotted'] as const).map((v) => (
        <div key={v}>
          <Divider variant={v} titlePlacement="start" plain>{v} · chữ thường</Divider>
          <Divider variant={v}>{v} · tiêu đề</Divider>
          <Divider variant={v} />
        </div>
      ))}
    </div>
  ),
}

export const VerticalLineStyles: Story = {
  render: () => (
    <Text>
      Liền<Divider orientation="vertical" />Gạch<Divider orientation="vertical" variant="dashed" />Chấm<Divider orientation="vertical" variant="dotted" />Hết
    </Text>
  ),
}
