import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Card, Button, Statistic, Space, Row, Col, Avatar } from 'antd'
import { Building02, DotsHorizontal, Edit01, Heart, Settings01, Share01 } from '../icons'

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'Components/Card',
  tags: ['ai-generated', 'needs-work'],
  // No JSDoc on these in antd's card/Card.d.ts — written from the API.
  argTypes: {
    title: { description: 'Card title.', control: 'text' },
    extra: { description: 'Content rendered at the top-right, alongside the title.', control: false },
    size: { description: 'Card density.', control: 'select', options: ['default', 'small'] },
    loading: { description: 'Shows a skeleton placeholder instead of the children.', control: 'boolean' },
    variant: { description: 'Whether the card draws its own border.', control: 'select', options: ['outlined', 'borderless'] },
    hoverable: { description: 'Lifts the card with a shadow on hover.', control: 'boolean' },
    type: { description: "Set to 'inner' for a card nested inside another card's body.", control: 'select', options: [undefined, 'inner'] },
    actions: { description: 'A row of icon actions along the bottom edge.', control: false },
    cover: { description: 'Content rendered above the header, e.g. an image.', control: false },
    tabList: { description: 'Renders a tab strip in the header; pair with activeTabKey/onTabChange.', control: false },
  },
}
export default meta
type Story = StoryObj<typeof Card>

const cover = (color: string) => <div style={{ height: 120, background: color }} />

export const Default: Story = {
  args: { title: 'Card title', style: { maxWidth: 320 }, children: 'Card content' },
}
export const WithExtra: Story = {
  args: {
    title: 'Card title',
    extra: <Button type="link">More</Button>,
    style: { maxWidth: 320 },
    children: <Statistic value={112893} prefix="$" />,
  },
}
export const Small: Story = {
  args: { title: 'Small size card', size: 'small', style: { width: 280 }, children: 'Card content' },
}

/** Ant Design's own "No border" example: `variant="borderless"` removes the card's outline. */
export const NoBorder: Story = {
  args: { title: 'Card title', variant: 'borderless', style: { maxWidth: 320 }, children: 'Card content' },
}

/** No title, no extra — just a bordered container for content. */
export const Simple: Story = {
  args: { style: { maxWidth: 320 }, children: 'Card content' },
}

/** `Card.Meta` lays out an avatar, title and description as one unit, alongside `cover` and `actions`. */
export const CustomizedContent: Story = {
  render: () => (
    <Card
      style={{ maxWidth: 320 }}
      cover={cover('#95DE64')}
      actions={[<Settings01 key="setting" />, <Edit01 key="edit" />, <DotsHorizontal key="ellipsis" />]}
    >
      <Card.Meta
        avatar={<Avatar icon={<Building02 />} />}
        title="Card title"
        description="This is the description"
      />
    </Card>
  ),
}

/** Cards laid out in a responsive grid via `Row`/`Col`, each borderless. */
export const InColumn: Story = {
  render: () => (
    <Row gutter={16}>
      {[1, 2, 3].map((n) => (
        <Col span={8} key={n}>
          <Card title="Card title" variant="borderless">
            Card content
          </Card>
        </Col>
      ))}
    </Row>
  ),
}

export const Loading: Story = { args: { title: 'Card title', loading: true, style: { maxWidth: 320 } } }

/** `Card.Grid` divides one card's body into its own bordered, hoverable cells. */
export const GridCard: Story = {
  render: () => {
    const cell: React.CSSProperties = { width: '25%', textAlign: 'center' }
    return (
      <Card title="Card title" style={{ maxWidth: 480 }}>
        <Card.Grid style={cell}>Content</Card.Grid>
        <Card.Grid hoverable={false} style={cell}>
          Content
        </Card.Grid>
        <Card.Grid style={cell}>Content</Card.Grid>
        <Card.Grid style={cell}>Content</Card.Grid>
      </Card>
    )
  },
}

/** `type="inner"` flattens a nested card's header for use inside another card's body. */
export const Inner: Story = {
  render: () => (
    <Card title="Card title" style={{ maxWidth: 480 }}>
      <Card type="inner" title="Inner Card title" extra={<a href="#">More</a>}>
        Inner Card content
      </Card>
      <Card style={{ marginTop: 16 }} type="inner" title="Inner Card title" extra={<a href="#">More</a>}>
        Inner Card content
      </Card>
    </Card>
  ),
}

/** `tabList`/`activeTabKey`/`onTabChange` render a tab strip in the card's own header. */
export const WithTabs: Story = {
  render: () => {
    const tabList = [
      { key: 'tab1', tab: 'Tab 1' },
      { key: 'tab2', tab: 'Tab 2' },
    ]
    const content: Record<string, React.ReactNode> = {
      tab1: <p>Content 1</p>,
      tab2: <p>Content 2</p>,
    }
    const [activeKey, setActiveKey] = useState('tab1')
    return (
      <Card
        style={{ maxWidth: 480 }}
        title="Card title"
        extra={<a href="#">More</a>}
        tabList={tabList}
        activeTabKey={activeKey}
        onTabChange={setActiveKey}
      >
        {content[activeKey]}
      </Card>
    )
  },
}

/** `hoverable` + `variant="borderless"` + `cover` + `Card.Meta`, combined. */
export const SupportMoreContentConfiguration: Story = {
  render: () => (
    <Card hoverable variant="borderless" style={{ width: 240 }} cover={cover('#69B1FF')}>
      <Card.Meta title="Card title" description="www.example.com" />
    </Card>
  ),
}

/** `classNames`/`styles` target individual semantic parts (root/header/body/title/...) without CSS overrides. */
export const CustomSemanticStyling: Story = {
  render: () => (
    <Space size="middle">
      <Card
        title="Object styling"
        variant="borderless"
        actions={[<Heart key="heart" style={{ color: '#ff6b6b' }} />, <Share01 key="share" style={{ color: '#4ecdc4' }} />, <Edit01 key="edit" style={{ color: '#45b7d1' }} />]}
        styles={{ root: { boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: 8 }, title: { fontSize: 14, fontWeight: 500 } }}
      >
        <Card.Meta avatar={<Avatar icon={<Building02 />} />} title="Card Meta title" description="This is the description" />
      </Card>
      <Card
        title="Function styling"
        variant="outlined"
        actions={[<Heart key="heart" style={{ color: '#ff6b6b' }} />, <Share01 key="share" style={{ color: '#4ecdc4' }} />, <Edit01 key="edit" style={{ color: '#45b7d1' }} />]}
        styles={(info) =>
          info.props.variant === 'outlined'
            ? { root: { borderColor: '#696FC7', boxShadow: '0 2px 8px #A7AAE1', borderRadius: 8 }, title: { fontSize: 14, fontWeight: 500, color: '#A7AAE1' } }
            : {}
        }
      >
        <Card.Meta avatar={<Avatar icon={<Building02 />} />} title="Card Meta title" description="This is the description" />
      </Card>
    </Space>
  ),
}
