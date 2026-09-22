import type { Meta, StoryObj } from '@storybook/react-vite'
import { Upload, Button } from 'antd'
import { Upload01, UploadCloud01 } from '../icons'
const meta: Meta<typeof Upload> = { component: Upload, tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof Upload>

export const Button_: Story = {
  name: 'With button',
  render: () => (
    <Upload beforeUpload={() => false}>
      <Button icon={<Upload01 />}>Chọn file</Button>
    </Upload>
  ),
}

export const Dragger: Story = {
  render: () => (
    <Upload.Dragger beforeUpload={() => false} style={{ maxWidth: 420 }}>
      <p><UploadCloud01 size={32} /></p>
      <p>Kéo file vào đây hoặc bấm để chọn</p>
    </Upload.Dragger>
  ),
}

export const PictureCard: Story = {
  render: () => <Upload listType="picture-card" beforeUpload={() => false}>+ Tải ảnh</Upload>,
}
