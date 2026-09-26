import { useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button/Button'
import { MessageCard, MessageRegion } from './Message'
import { message } from './messageApi'

const meta = {
  title: 'Components/Message',
  component: MessageCard,
  args: { type: 'success', children: 'Đã lưu thực đơn' },
  argTypes: {
    type: { control: 'select', options: ['info', 'success', 'warning', 'error', 'loading'] },
    children: { control: 'text' },
  },
} satisfies Meta<typeof MessageCard>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--fc-space-margin-base)' } as const
const row = { display: 'flex', gap: 'var(--fc-space-margin-xs)', flexWrap: 'wrap' } as const

/** Figma "❖ Message", one card drawn in place; pick the Type in the controls. */
export const Playground: Story = {}

/** Figma "❖ Message" Type = Normal (`info`), Success, Warning, Error, Loading. */
export const Types: Story = {
  render: () => (
    <div style={stack}>
      <MessageCard type="info">Chi nhánh Quận 1 đang dùng thực đơn mùa hè</MessageCard>
      <MessageCard type="success">Đã lưu thực đơn</MessageCard>
      <MessageCard type="warning">Máy in bếp sắp hết giấy</MessageCard>
      <MessageCard type="error">Không thể kết nối máy in</MessageCard>
      <MessageCard type="loading">Đang đồng bộ đơn hàng…</MessageCard>
    </div>
  ),
}

/**
 * The real queue: each button calls `message.*`. Messages stack at the top
 * centre, newest first, and close after 3 s — hovering or focusing one
 * pauses the timer. F6 moves keyboard focus to the region.
 */
export const Interactive: Story = {
  render: () => (
    <>
      <div style={row}>
        <Button onPress={() => message.success('Đã lưu thực đơn')}>Thành công</Button>
        <Button onPress={() => message.error('Không thể kết nối máy in')}>Lỗi</Button>
        <Button onPress={() => message.warning('Máy in bếp sắp hết giấy')}>Cảnh báo</Button>
        <Button onPress={() => message.info('Chi nhánh Quận 1 đang dùng thực đơn mùa hè')}>Thông tin</Button>
      </div>
      <MessageRegion />
    </>
  ),
}

/** Figma Type = Loading: `message.loading` stays until its `close()` runs — here after a 2 s fake sync, followed by a success message. */
export const LoadingThenSuccess: Story = {
  render: () => (
    <>
      <Button
        variant="primary"
        onPress={() => {
          const done = message.loading('Đang đồng bộ đơn hàng…')
          setTimeout(() => {
            done()
            message.success('Đã đồng bộ 12 đơn hàng')
          }, 2000)
        }}
      >
        Đồng bộ đơn hàng
      </Button>
      <MessageRegion />
    </>
  ),
}

function LiveMessages() {
  useEffect(() => {
    const closers = [
      message.loading('Đang đồng bộ đơn hàng…'),
      message.error('Không thể kết nối máy in', { duration: 0 }),
      message.warning('Máy in bếp sắp hết giấy', { duration: 0 }),
      message.success('Đã lưu thực đơn', { duration: 0 }),
      message.info('Chi nhánh Quận 1 đang dùng thực đơn mùa hè', { duration: 0 }),
    ]
    return () => closers.forEach((close) => close())
  }, [])
  return <MessageRegion />
}

/**
 * The live region open on load, every Type held open (`duration: 0`), for
 * visual and accessibility review without pressing anything. Kept off the
 * docs page, where it would sit over the other stories.
 */
export const LiveOpen: Story = {
  tags: ['!autodocs'],
  render: () => <LiveMessages />,
}
