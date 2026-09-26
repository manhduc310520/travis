import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flex } from '../Flex/Flex'
import { Link, Paragraph, Text, Title } from './Typography'

const meta = {
  title: 'Components/Typography',
  component: Text,
  args: { children: 'Nhà hàng Phố Cổ', tone: 'default', size: 'base' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['default', 'secondary', 'success', 'warning', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'base', 'lg'] },
  },
} satisfies Meta<typeof Text>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Titles: Story = {
  render: () => (
    <Flex direction="column" gap="sm">
      <Title level={1}>Tiêu đề cấp 1</Title>
      <Title level={2}>Tiêu đề cấp 2</Title>
      <Title level={3}>Tiêu đề cấp 3</Title>
      <Title level={4}>Tiêu đề cấp 4</Title>
      <Title level={5}>Tiêu đề cấp 5</Title>
    </Flex>
  ),
}

export const Tones: Story = {
  render: () => (
    <Flex direction="column" gap="xs">
      <Text>Mặc định</Text>
      <Text tone="secondary">Phụ — mô tả, chú thích</Text>
      <Text tone="success">Thành công — đã lưu</Text>
      <Text tone="warning">Cảnh báo — sắp hết hàng</Text>
      <Text tone="danger">Lỗi — không lưu được</Text>
      <Text disabled>Bị vô hiệu</Text>
    </Flex>
  ),
}

export const Styles: Story = {
  render: () => (
    <Flex direction="column" gap="xs">
      <Text strong>Đậm (semibold)</Text>
      <Text code>POS-1042</Text>
      <Text underline>Gạch chân</Text>
      <Text delete>Gạch ngang</Text>
      <Text mark>Đánh dấu</Text>
      <Text>Nhấn <Text keyboard>Ctrl</Text> + <Text keyboard>K</Text> để tìm nhanh</Text>
    </Flex>
  ),
}

const long =
  'Nhà hàng Phố Cổ phục vụ các món ăn truyền thống Hà Nội trong không gian nhà phố cổ. ' +
  'Thực đơn thay đổi theo mùa, nguyên liệu được chọn mỗi sáng từ chợ Đồng Xuân. ' +
  'Nhà hàng nhận đặt bàn cho nhóm từ 2 đến 40 khách và có phòng riêng cho sự kiện.'

export const Paragraphs: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Paragraph>{long}</Paragraph>
      <Paragraph tone="secondary" truncate={2}>{long}</Paragraph>
      <Paragraph truncate>{long}</Paragraph>
    </div>
  ),
}

export const Links: Story = {
  render: () => (
    <Flex direction="column" gap="xs" align="start">
      <Link href="#">Xem chi tiết nhà hàng</Link>
      <Link href="https://example.com" target="_blank" rel="noreferrer">Mở trang ngoài</Link>
      <Link href="#" underline>Liên kết luôn gạch chân</Link>
      <Link isDisabled>Liên kết bị vô hiệu</Link>
    </Flex>
  ),
}

/** Figma Text Size: SM 12/20, Base 14/22, LG 16/24 — for every tone. */
export const Sizes: Story = {
  render: () => (
    <Flex direction="column" gap="xs">
      {(['sm', 'base', 'lg'] as const).map((size) => (
        <Flex key={size} gap="base" align="baseline">
          <Text size={size} strong>{size.toUpperCase()}</Text>
          <Text size={size}>Mặc định</Text>
          <Text size={size} tone="secondary">Phụ</Text>
          <Text size={size} tone="success">Thành công</Text>
          <Text size={size} tone="warning">Cảnh báo</Text>
          <Text size={size} tone="danger">Lỗi</Text>
          <Text size={size} mark>Đánh dấu</Text>
          <Text size={size} code>POS-1042</Text>
        </Flex>
      ))}
    </Flex>
  ),
}

function EditableTitleDemo() {
  const [name, setName] = useState('Nhà hàng Phố Cổ')
  return (
    <div style={{ maxWidth: 480 }}>
      <Title level={3} editable onEdit={setName} editLabel="Sửa tên nhà hàng">{name}</Title>
      <Text tone="secondary">Bấm biểu tượng bút để sửa; Enter lưu, Esc hủy.</Text>
    </div>
  )
}

/** Figma Title "Editable". */
export const EditableTitle: Story = { render: () => <EditableTitleDemo /> }
