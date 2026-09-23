import type { Meta, StoryObj } from '@storybook/react-vite'
import { Result, Button } from 'antd'

const meta: Meta<typeof Result> = {
  component: Result,
  title: 'Components/Result',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's result types — written from the API.
  argTypes: {
    status: {
      description: 'Icon and color preset. HTTP-code values (403/404/500) render that code as the icon.',
      control: 'select',
      options: ['success', 'error', 'info', 'warning', '404', '403', '500'],
    },
    title: { description: 'Main heading.', control: 'text' },
    subTitle: { description: 'Supporting text under the title.', control: 'text' },
    extra: { description: 'Actions rendered below the text (e.g. buttons).', control: false },
  },
}
export default meta
type Story = StoryObj<typeof Result>

export const Success: Story = {
  args: {
    status: 'success',
    title: 'Đã tạo nhà hàng',
    subTitle: 'Mã POS-1042 đã sẵn sàng bán hàng.',
    extra: <Button type="primary">Về danh sách</Button>,
  },
}

export const NotFound: Story = {
  args: { status: '404', title: '404', subTitle: 'Không tìm thấy trang bạn cần.' },
}

export const ErrorState: Story = {
  args: { status: 'error', title: 'Tạo nhà hàng thất bại', subTitle: 'Kiểm tra lại thông tin rồi thử lại.' },
}
