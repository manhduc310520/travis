import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Input } from 'antd'
import { SearchMd } from '../icons'
const meta = {
  component: Input,
  tags: ['ai-generated', 'needs-work'],
  args: { placeholder: 'Tìm kiếm nhà hàng', style: { maxWidth: 320 } },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText('Tìm kiếm nhà hàng')).toBeVisible()
  },
}

export const WithPrefix: Story = { args: { prefix: <SearchMd /> } }

export const Disabled: Story = { args: { disabled: true } }

export const Invalid: Story = { args: { status: 'error', defaultValue: 'sai định dạng' } }

/** Proves the focus ring uses the brand-aware `controlOutline` token. */
export const Focused: Story = {
  args: { prefix: <SearchMd /> },
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByPlaceholderText('Tìm kiếm nhà hàng')
    await userEvent.click(field)
    await expect(field).toHaveFocus()
  },
}
