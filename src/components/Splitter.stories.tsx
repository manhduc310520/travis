import type { Meta, StoryObj } from '@storybook/react-vite'
import { Splitter, Typography } from 'antd'

const meta: Meta<typeof Splitter> = { component: Splitter, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Splitter>

export const TwoPanes: Story = {
  render: () => (
    <Splitter style={{ height: 240, boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}>
      <Splitter.Panel defaultSize="40%">
        <div style={{ padding: 16 }}><Typography.Text>Danh sách</Typography.Text></div>
      </Splitter.Panel>
      <Splitter.Panel>
        <div style={{ padding: 16 }}><Typography.Text>Chi tiết</Typography.Text></div>
      </Splitter.Panel>
    </Splitter>
  ),
}
