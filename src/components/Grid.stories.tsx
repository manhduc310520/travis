import type { Meta, StoryObj } from '@storybook/react-vite'
import { Row, Col, Card } from 'antd'

const meta: Meta<typeof Row> = {
  component: Row,
  title: 'Components/Grid',
  tags: ['ai-generated', 'needs-work'],
  // Every story uses a custom `render`, none set `args` — the Docs page's
  // argTypes table only renders once at least one arg exists. `span`/
  // `xs`/`sm`/`md`/`lg` used in these stories belong to `Col`, a different
  // component from the one documented here (`Row`), so they aren't listed.
  args: { gutter: 16 },
  argTypes: {
    gutter: { description: 'Horizontal/vertical spacing between columns.', control: false },
  },
}
export default meta
type Story = StoryObj<typeof Row>

export const TwentyFourColumns: Story = {
  render: () => (
    <Row gutter={[16, 16]}>
      {[6, 6, 6, 6, 8, 8, 8, 12, 12].map((span, i) => (
        <Col key={i} span={span}>
          <Card size="small">span {span}</Card>
        </Col>
      ))}
    </Row>
  ),
}

export const Responsive: Story = {
  render: () => (
    <Row gutter={[16, 16]}>
      {[1, 2, 3, 4].map((n) => (
        <Col key={n} xs={24} sm={12} md={8} lg={6}>
          <Card size="small">Col {n}</Card>
        </Col>
      ))}
    </Row>
  ),
}
