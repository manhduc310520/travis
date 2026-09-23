import type { Meta, StoryObj } from '@storybook/react-vite'
import { Typography, Space } from 'antd'

const { Title, Text, Paragraph, Link } = Typography

const meta: Meta<typeof Typography> = { component: Typography, title: 'Components/Typography', tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Typography>

export const Headings: Story = {
  render: () => (
    <div>
      <Title level={1}>Danh sách nhà hàng</Title>
      <Title level={2}>Danh sách nhà hàng</Title>
      <Title level={3}>Danh sách nhà hàng</Title>
      <Title level={4}>Danh sách nhà hàng</Title>
      <Title level={5}>Danh sách nhà hàng</Title>
    </div>
  ),
}

export const TextVariants: Story = {
  render: () => (
    <Space orientation="vertical">
      <Text>Văn bản thường</Text>
      <Text type="secondary">Văn bản phụ</Text>
      <Text type="success">Thành công</Text>
      <Text type="warning">Cảnh báo</Text>
      <Text type="danger">Lỗi</Text>
      <Text disabled>Vô hiệu hoá</Text>
      <Text strong>Đậm 600</Text>
      <Text code>colorPrimary</Text>
      <Link href="#">Liên kết</Link>
    </Space>
  ),
}

export const BodyCopy: Story = {
  render: () => (
    <Paragraph style={{ maxWidth: 560 }}>
      FABi CMS là web app quản trị chính trong hệ sinh thái iPOS. Chủ quán và đội ngũ dùng nó để xem
      báo cáo doanh thu, sửa thực đơn, và xử lý hoá đơn điện tử.
    </Paragraph>
  ),
}
