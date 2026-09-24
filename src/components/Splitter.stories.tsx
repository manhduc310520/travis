import type { Meta, StoryObj } from '@storybook/react-vite'
import { Splitter, Typography } from 'antd'

const meta: Meta<typeof Splitter> = {
  component: Splitter,
  title: 'Components/Splitter',
  tags: ['ai-generated', 'needs-work'],
  // The story's only configured prop is `defaultSize`, which belongs to
  // `Splitter.Panel`, a different component from the one named here — not
  // listed as an argType on this meta. Adding a default `orientation` just
  // so the Docs page's argTypes table has something to key off.
  args: { orientation: 'horizontal' },
  argTypes: {
    orientation: { description: 'Direction the panes are arranged in.', control: 'select', options: ['horizontal', 'vertical'] },
  },
}
export default meta
type Story = StoryObj<typeof Splitter>

export const TwoPanes: Story = {
  render: () => (
    <Splitter style={{ height: 240, boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}>
      <Splitter.Panel defaultSize="40%">
        <div style={{ padding: 16 }}><Typography.Text>First</Typography.Text></div>
      </Splitter.Panel>
      <Splitter.Panel>
        <div style={{ padding: 16 }}><Typography.Text>Second</Typography.Text></div>
      </Splitter.Panel>
    </Splitter>
  ),
}
