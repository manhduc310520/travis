import type { Meta, StoryObj } from '@storybook/react-vite'
import { DemoBox } from '../../docs/DemoBox'
import { Flex } from './Flex'

const meta = {
  title: 'Components/Layout/Flex',
  component: Flex,
  args: { gap: 'sm', direction: 'row', wrap: false },
  argTypes: {
    gap: { control: 'select', options: ['xxs', 'xs', 'sm', 'base', 'md', 'lg', 'xl', 'xxl'] },
    direction: { control: 'inline-radio', options: ['row', 'column'] },
    align: { control: 'select', options: [undefined, 'start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: [undefined, 'start', 'center', 'end', 'between', 'around', 'evenly'] },
  },
  render: (args) => (
    <Flex {...args}>
      <DemoBox>Một</DemoBox>
      <DemoBox>Hai</DemoBox>
      <DemoBox>Ba</DemoBox>
    </Flex>
  ),
} satisfies Meta<typeof Flex>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const GapScale: Story = {
  render: () => (
    <Flex direction="column" gap="base">
      {(['xxs', 'xs', 'sm', 'base', 'lg', 'xl'] as const).map((g) => (
        <Flex key={g} gap={g} align="center">
          <code style={{ width: 48 }}>{g}</code>
          <DemoBox>A</DemoBox>
          <DemoBox>B</DemoBox>
          <DemoBox>C</DemoBox>
        </Flex>
      ))}
    </Flex>
  ),
}

export const Column: Story = { args: { direction: 'column', gap: 'xs' } }

export const SpaceBetween: Story = {
  render: () => (
    <Flex justify="between" align="center" style={{ maxWidth: 480 }}>
      <DemoBox>Tiêu đề trang</DemoBox>
      <DemoBox>Hành động</DemoBox>
    </Flex>
  ),
}

export const Wrap: Story = {
  render: () => (
    <Flex wrap gap="xs" style={{ maxWidth: 320 }}>
      {Array.from({ length: 12 }, (_, i) => <DemoBox key={i}>Mục {i + 1}</DemoBox>)}
    </Flex>
  ),
}
