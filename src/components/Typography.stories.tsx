import type { Meta, StoryObj } from '@storybook/react-vite'
import { Typography, Space } from 'antd'

const { Title, Text, Paragraph, Link } = Typography

const meta: Meta<typeof Typography> = { component: Typography, title: 'Components/Typography', tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Typography>

export const Headings: Story = {
  render: () => (
    <div>
      <Title level={1}>h1. Heading</Title>
      <Title level={2}>h2. Heading</Title>
      <Title level={3}>h3. Heading</Title>
      <Title level={4}>h4. Heading</Title>
      <Title level={5}>h5. Heading</Title>
    </div>
  ),
}

export const TextVariants: Story = {
  render: () => (
    <Space orientation="vertical">
      <Text>Default text</Text>
      <Text type="secondary">Secondary text</Text>
      <Text type="success">Success text</Text>
      <Text type="warning">Warning text</Text>
      <Text type="danger">Danger text</Text>
      <Text disabled>Disabled text</Text>
      <Text strong>Strong text (600)</Text>
      <Text code>colorPrimary</Text>
      <Link href="#">Link</Link>
    </Space>
  ),
}

export const BodyCopy: Story = {
  render: () => (
    <Paragraph style={{ maxWidth: 560 }}>
      FABi CMS is the main admin web app in the iPOS ecosystem. Restaurant owners and their teams use
      it to view revenue reports, edit menus, and handle e-invoices.
    </Paragraph>
  ),
}
