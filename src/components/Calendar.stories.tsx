import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calendar, Col, Radio, Row, Select, Typography } from 'antd'
import type { Dayjs } from 'dayjs'

const meta: Meta<typeof Calendar> = {
  component: Calendar,
  title: 'Components/Calendar',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on `fullscreen` in antd's calendar types — written from the API.
  argTypes: {
    fullscreen: { description: 'Full grid layout (true) vs a compact single-column layout for narrow spaces.', control: 'boolean' },
    headerRender: { description: 'Replaces the built-in month/year header with a custom one.', control: false },
  },
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
            <Typography.Title level={4}>Custom header</Typography.Title>
            <Row gutter={8}>
              <Col>
                <Radio.Group size="small" onChange={(e) => onTypeChange(e.target.value)} value={type}>
                  <Radio.Button value="month">Month</Radio.Button>
                  <Radio.Button value="year">Year</Radio.Button>
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
