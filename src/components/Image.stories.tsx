import type { Meta, StoryObj } from '@storybook/react-vite'
import { Image } from 'antd'

const meta: Meta<typeof Image> = {
  component: Image,
  tags: ['ai-generated', 'needs-work'],
}
export default meta
type Story = StoryObj<typeof Image>

export const Default: Story = {
  args: {
    width: 200,
    src: 'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
  },
}

/** From the Figma component's Code Connect example. */
export const PreviewGroup: Story = {
  render: () => (
    <Image.PreviewGroup
      items={[
        'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
        'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
        'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
      ]}
    >
      <Image
        width={200}
        src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
      />
    </Image.PreviewGroup>
  ),
}

export const Fallback: Story = {
  args: {
    src: 'https://broken-url-does-not-exist.example/x.png',
    fallback: 'https://gw.alipayobjects.com/zos/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    width: 200,
  },
}
