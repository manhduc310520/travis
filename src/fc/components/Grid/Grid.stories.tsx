import type { Meta, StoryObj } from '@storybook/react-vite'
import { DemoBox } from '../../docs/DemoBox'
import { Flex } from '../Flex/Flex'
import { Col, Row } from './Grid'

const meta = {
  title: 'Components/Layout/Grid',
  component: Row,
  args: { gap: 'base' },
  argTypes: { gap: { control: 'select', options: ['xxs', 'xs', 'sm', 'base', 'md', 'lg', 'xl', 'xxl'] } },
} satisfies Meta<typeof Row>
export default meta
type Story = StoryObj<typeof meta>

export const TwentyFourColumns: Story = {
  render: (args) => (
    <Flex direction="column" gap="base">
      {[24, 12, 8, 6, 4, 3].map((span) => (
        <Row key={span} {...args}>
          {Array.from({ length: 24 / span }, (_, i) => (
            <Col key={i} span={span}><DemoBox>{span}</DemoBox></Col>
          ))}
        </Row>
      ))}
    </Flex>
  ),
}

export const Responsive: Story = {
  render: (args) => (
    <Row {...args}>
      {Array.from({ length: 4 }, (_, i) => (
        <Col key={i} span={24} sm={12} md={8} lg={6}>
          <DemoBox>24 → sm 12 → md 8 → lg 6</DemoBox>
        </Col>
      ))}
    </Row>
  ),
}

export const Offset: Story = {
  render: (args) => (
    <Flex direction="column" gap="base">
      <Row {...args}>
        <Col span={8}><DemoBox>8</DemoBox></Col>
        <Col span={8} offset={8}><DemoBox>8, lệch 8</DemoBox></Col>
      </Row>
      <Row {...args}>
        <Col span={12} offset={6}><DemoBox>12, lệch 6</DemoBox></Col>
      </Row>
    </Flex>
  ),
}

export const HiddenBelowMd: Story = {
  render: (args) => (
    <Row {...args}>
      <Col span={24} md={16}><DemoBox>Nội dung</DemoBox></Col>
      <Col span={0} md={8}><DemoBox>Cột phụ (ẩn dưới md)</DemoBox></Col>
    </Row>
  ),
}
