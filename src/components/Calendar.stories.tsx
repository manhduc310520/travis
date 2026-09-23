import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calendar, Col, Radio, Row, Select, Typography } from 'antd'
import type { Dayjs } from 'dayjs'

const meta: Meta<typeof Calendar> = {
  component: Calendar,
  tags: ['ai-generated', 'needs-work'],
}
export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {}

export const Fullscreen: Story = { args: { fullscreen: true } }

/** From the Figma component's Code Connect example ("Calendar / Card"). */
export const CustomHeader: Story = {
  render: () => (
    <Calendar
      fullscreen={false}
      headerRender={({ value, type, onChange, onTypeChange }) => {
        const months = Array.from({ length: 12 }, (_, i) => value.clone().month(i).format('MMM'))
        const year = value.year()

        return (
          <div style={{ padding: 8 }}>
            <Typography.Title level={4}>Tuỳ chỉnh header</Typography.Title>
            <Row gutter={8}>
              <Col>
                <Radio.Group size="small" onChange={(e) => onTypeChange(e.target.value)} value={type}>
                  <Radio.Button value="month">Tháng</Radio.Button>
                  <Radio.Button value="year">Năm</Radio.Button>
                </Radio.Group>
              </Col>
              <Col>
                <Select
                  size="small"
                  value={year}
                  onChange={(newYear: number) => onChange(value.clone().year(newYear))}
                  options={Array.from({ length: 20 }, (_, i) => year - 10 + i).map((y) => ({
                    value: y,
                    label: y,
                  }))}
                />
              </Col>
              <Col>
                <Select
                  size="small"
                  value={value.month()}
                  onChange={(newMonth: number) => onChange(value.clone().month(newMonth))}
                  options={months.map((m, i) => ({ value: i, label: m }))}
                />
              </Col>
            </Row>
          </div>
        )
      }}
      onPanelChange={(value: Dayjs, mode) => console.log(value.format('YYYY-MM-DD'), mode)}
    />
  ),
}
