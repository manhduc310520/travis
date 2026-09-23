import type { Meta, StoryObj } from '@storybook/react-vite'
import { List, Avatar, Button } from 'antd'
import { Building02 } from '../icons'
const meta: Meta<typeof List> = { component: List, title: 'Components/List', tags: ['ai-generated', 'needs-work'] }
export default meta
type Story = StoryObj<typeof List>

const data = [
  { title: 'Trà sữa 344', desc: 'Cầu Giấy, Hà Nội' },
  { title: 'Gà rán 365', desc: 'Hải Châu, Đà Nẵng' },
  { title: 'Cơm tấm Bảy', desc: 'Quận 1, TP. Hồ Chí Minh' },
]

export const Default: Story = {
  render: () => (
    <List
      style={{ maxWidth: 520 }}
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item actions={[<Button key="edit" type="link">Sửa</Button>]}>
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
