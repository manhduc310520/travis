import type { Meta, StoryObj } from '@storybook/react-vite'
import { Statistic, Row, Col, Card } from 'antd'
import { ArrowUp } from '../icons'
const meta: Meta<typeof Statistic> = {
  component: Statistic,
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's statistic types — written from the API.
  argTypes: {
    title: { description: 'Label shown above the value.', control: 'text' },
    value: { description: 'The number (or text) to display.', control: 'text' },
    precision: { description: 'Decimal places to round the value to.', control: 'number' },
    prefix: { description: 'Content rendered before the value.', control: false },
    suffix: { description: 'Content rendered after the value.', control: 'text' },
  },
}
export default meta
type Story = StoryObj<typeof Statistic>

export const Default: Story = { args: { title: 'Doanh thu hôm nay', value: 112893, suffix: 'đ' } }

export const WithTrend: Story = {
  args: { title: 'So với hôm qua', value: 11.28, precision: 2, prefix: <ArrowUp />, suffix: '%' },
}

export const InCards: Story = {
  render: () => (
    <Row gutter={16}>
      <Col>
        <Card><Statistic title="Đơn hàng" value={1242} /></Card>
      </Col>
      <Col>
        <Card><Statistic title="Khách hàng" value={860} /></Card>
      </Col>
    </Row>
  ),
}
