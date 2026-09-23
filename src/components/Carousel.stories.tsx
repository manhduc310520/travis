import type { Meta, StoryObj } from '@storybook/react-vite'
import { Carousel } from 'antd'

const meta: Meta<typeof Carousel> = { component: Carousel, title: 'Components/Carousel', tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Carousel>

const slide = (label: string, bg: string) => (
  <div key={label} style={{ height: 160, background: bg, color: '#fff', display: 'grid', placeItems: 'center' }}>
    {label}
  </div>
)

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Carousel>
        {slide('Khuyến mãi tháng 1', '#003EB3')}
        {slide('Khuyến mãi tháng 2', '#0958D9')}
        {slide('Khuyến mãi tháng 3', '#1677FF')}
      </Carousel>
    </div>
  ),
}
