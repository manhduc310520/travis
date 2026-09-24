import type { Meta, StoryObj } from '@storybook/react-vite'
import { List, Avatar, Button } from 'antd'
import { Building02 } from '../icons'
const meta: Meta<typeof List> = { component: List, title: 'Components/List', tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof List>

const data = [
  { title: 'Title 1', desc: 'Description 1' },
  { title: 'Title 2', desc: 'Description 2' },
  { title: 'Title 3', desc: 'Description 3' },
]

export const Default: Story = {
  render: () => (
    <List
      style={{ maxWidth: 520 }}
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item actions={[<Button key="edit" type="link">Edit</Button>]}>
          <List.Item.Meta
            avatar={<Avatar icon={<Building02 />} />}
            title={item.title}
            description={item.desc}
          />
        </List.Item>
      )}
    />
  ),
}
