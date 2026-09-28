import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button/Button'
import { DemoBox } from '../../docs/DemoBox'
import { Divider } from '../Divider/Divider'
import { Link } from '../Typography/Typography'
import { Space } from './Space'

const meta = {
  title: 'Components/Layout/Space',
  component: Space,
  args: { size: 'sm', direction: 'row' },
  argTypes: {
    size: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
    direction: { control: 'inline-radio', options: ['row', 'column'] },
  },
  render: (args) => (
    <Space {...args}>
      <Button variant="primary">Lưu</Button>
      <Button>Hủy</Button>
      <Button variant="text">Xem trước</Button>
    </Space>
  ),
} satisfies Meta<typeof Space>
export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {}
export const Vertical: Story = { args: { direction: 'column', align: 'start' } }

export const Sizes: Story = {
  render: () => (
    <Space direction="column" size="lg" align="start">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Space key={s} size={s}>
          <Button>{s}</Button>
          <Button>{s}</Button>
          <Button>{s}</Button>
        </Space>
      ))}
    </Space>
  ),
}

export const Split: Story = {
  render: () => (
    <Space split={<Divider orientation="vertical" />}>
      <Link href="#">Sửa</Link>
      <Link href="#">Nhân bản</Link>
      <Link href="#">Xóa</Link>
    </Space>
  ),
}

const slot = (i: number) => <DemoBox key={i}>{i + 1}</DemoBox>

/** Figma Space Slots 1–12, vertical and horizontal. */
export const Slots: Story = {
  render: () => (
    <Space direction="column" size="lg" align="start">
      {[1, 2, 3, 4, 5, 6, 7, 8, 12].map((n) => (
        <Space key={n} size="sm">{Array.from({ length: n }, (_, i) => slot(i))}</Space>
      ))}
      <Space size="md" align="start">
        {[2, 4, 6].map((n) => (
          <Space key={n} direction="column" size="sm">{Array.from({ length: n }, (_, i) => slot(i))}</Space>
        ))}
      </Space>
    </Space>
  ),
}

/** Figma Space: None, Small, Middle, Large. */
export const AllSizes: Story = {
  render: () => (
    <Space direction="column" size="lg" align="start">
      {(['none', 'sm', 'md', 'lg'] as const).map((size) => (
        <Space key={size} size={size}>{Array.from({ length: 4 }, (_, i) => slot(i))}</Space>
      ))}
    </Space>
  ),
}
