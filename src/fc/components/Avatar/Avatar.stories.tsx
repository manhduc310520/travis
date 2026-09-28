import type { Meta, StoryObj } from '@storybook/react-vite'
import { Building02 } from '../../../icons'
import { Badge } from '../Badge/Badge'
import { Avatar, AvatarGroup } from './Avatar'

// A local stand-in photo, so stories never depend on the network.
const PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffc069"/><stop offset="1" stop-color="#d46b08"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><circle cx="32" cy="26" r="11" fill="#fff7e6"/><path d="M12 60c2-12 10-18 20-18s18 6 20 18z" fill="#fff7e6"/></svg>',
)}`

const meta = {
  title: 'Components/Data Display/Avatar',
  component: Avatar,
  args: { alt: 'Nguyễn Minh Anh', children: 'MA', size: 'md', shape: 'circle', color: 'default' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    color: { control: 'select', options: ['default', 'blue', 'cyan', 'green', 'magenta', 'orange', 'purple'] },
  },
} satisfies Meta<typeof Avatar>
export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 'var(--fc-space-margin-base)', alignItems: 'center', flexWrap: 'wrap' } as const

export const Playground: Story = {}

export const Content: Story = {
  render: () => (
    <div style={row}>
      <Avatar alt="Trần Thu Hà" src={PHOTO} />
      <Avatar alt="Trần Thu Hà">TH</Avatar>
      <Avatar alt="Người dùng chưa đặt tên" />
      <Avatar alt="Chi nhánh Quận 1" icon={<Building02 />} color="blue" />
      <Avatar alt="Lê Quốc Bảo" src="/khong-ton-tai.png">QB</Avatar>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-base)' }}>
      <div style={row}>
        <Avatar alt="Nhỏ" size="sm">MA</Avatar>
        <Avatar alt="Chuẩn">MA</Avatar>
        <Avatar alt="Lớn" size="lg">MA</Avatar>
      </div>
      <div style={row}>
        <Avatar alt="Nhỏ" size="sm" shape="square" icon={<Building02 />} />
        <Avatar alt="Chuẩn" shape="square" icon={<Building02 />} />
        <Avatar alt="Lớn" size="lg" shape="square" icon={<Building02 />} />
      </div>
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div style={row}>
      {(['default', 'blue', 'cyan', 'green', 'lime', 'amber', 'orange', 'red', 'magenta', 'purple'] as const).map((c) => (
        <Avatar key={c} alt={`Màu ${c}`} color={c}>{c.slice(0, 2).toUpperCase()}</Avatar>
      ))}
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup max={4} aria-label="Nhân viên ca sáng">
      <Avatar alt="Trần Thu Hà" src={PHOTO} />
      <Avatar alt="Nguyễn Minh Anh" color="blue">MA</Avatar>
      <Avatar alt="Lê Quốc Bảo" color="green">QB</Avatar>
      <Avatar alt="Phạm Gia Huy" color="purple">GH</Avatar>
      <Avatar alt="Võ Lan Chi" color="orange">LC</Avatar>
      <Avatar alt="Đỗ Hải Nam" color="cyan">HN</Avatar>
    </AvatarGroup>
  ),
}

/** Figma Size=Custom: any pixel size. */
export const CustomSize: Story = {
  render: () => (
    <div style={row}>
      <Avatar alt="Trần Thu Hà" src={PHOTO} size={48} />
      <Avatar alt="Nguyễn Minh Anh" size={56} color="blue">MA</Avatar>
      <Avatar alt="Chi nhánh" size={64} shape="square" icon={<Building02 />} color="green" />
      <Avatar alt="Lê Quốc Bảo" size={20}>QB</Avatar>
    </div>
  ),
}

/** Figma Badge=true: image avatars with a dot or count, circle and square, every size. */
export const WithBadge: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-lg)' }}>
      {(['circle', 'square'] as const).map((shape) => (
        <div key={shape} style={{ ...row, gap: 'var(--fc-space-margin-lg)' }}>
          <Badge dot label="Đang trực tuyến"><Avatar alt="Trần Thu Hà" src={PHOTO} size="sm" shape={shape} /></Badge>
          <Badge count={3} label="3 tin nhắn mới"><Avatar alt="Trần Thu Hà" src={PHOTO} shape={shape} /></Badge>
          <Badge count={12} label="12 tin nhắn mới"><Avatar alt="Trần Thu Hà" src={PHOTO} size="lg" shape={shape} /></Badge>
          <Badge dot label="Đang trực tuyến"><Avatar alt="Trần Thu Hà" src={PHOTO} size={56} shape={shape} /></Badge>
        </div>
      ))}
    </div>
  ),
}

/** Figma Avatar Group: small, default and large. */
export const GroupSizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-base)' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <AvatarGroup key={size} max={3} size={size} aria-label="Nhân viên ca sáng">
          <Avatar alt="Trần Thu Hà" src={PHOTO} size={size} />
          <Avatar alt="Nguyễn Minh Anh" color="blue" size={size}>MA</Avatar>
          <Avatar alt="Lê Quốc Bảo" color="green" size={size}>QB</Avatar>
          <Avatar alt="Phạm Gia Huy" color="purple" size={size}>GH</Avatar>
          <Avatar alt="Võ Lan Chi" color="orange" size={size}>LC</Avatar>
        </AvatarGroup>
      ))}
    </div>
  ),
}
