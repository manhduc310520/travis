// FABi's own component (not converted from antd): packages/fabi-ui/src/StatisticCard.tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Col, Row, StatisticCard, Tag } from '@fabi/ui'
import { File06Line, FileCheck02Line, Percent03Line, Users01Line } from '@fabi/ui/fabi-icons'
import { fn } from 'storybook/test'

const meta: Meta<typeof StatisticCard> = {
  title: 'Components/Data Display/Statistic Card',
  component: StatisticCard,
  tags: ['autodocs'],
  args: {
    title: 'Tổng hoá đơn',
    value: 60,
    description: 'Trung bình 160.266 ₫ / hoá đơn',
    icon: <File06Line />,
    color: 'orange',
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['default', 'primary'] },
    icon: { control: false },
    extra: { control: false },
    onClick: { control: false },
    onRetry: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
}
export default meta
type Story = StoryObj<typeof StatisticCard>

const revenue = { type: 'primary' as const, title: 'Doanh thu (Gross)', value: 9615933, suffix: '₫', trend: 8, comparison: 'so với Từ ngày 01/05 đến ngày 31/05', description: undefined, icon: undefined }
const wide: Story['decorators'] = [(Story) => <div style={{ maxWidth: 'none' }}><Story /></div>]

export const Default: Story = {}
export const Primary: Story = { args: revenue, decorators: wide }

/** The dashboard: one component, the headline figure on the brand surface and four category colours */
export const Dashboard: Story = {
  decorators: wide,
  render: () => (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <StatisticCard {...revenue} />
      </Col>
      <Col xs={24} sm={12} xl={6}>
        <StatisticCard title="Giảm giá và chi phí" value={1500000} suffix="₫" description="Trung bình 160.266 ₫ / hoá đơn" icon={<Percent03Line />} color="blue" />
      </Col>
      <Col xs={24} sm={12} xl={6}>
        <StatisticCard title="Tổng hoá đơn" value={60} description="Trung bình 160.266 ₫ / hoá đơn" icon={<File06Line />} color="orange" />
      </Col>
      <Col xs={24} sm={12} xl={6}>
        <StatisticCard title="Số khách" value={23} description="Trung bình 20.000 ₫ / khách" icon={<Users01Line />} color="green" />
      </Col>
      <Col xs={24} sm={12} xl={6}>
        <StatisticCard title="Số hoá đơn điện tử" value={900} icon={<FileCheck02Line />} color="magenta" extra={<><Tag>Chanhdev</Tag><Tag>+5</Tag></>} />
      </Col>
    </Row>
  ),
}

export const TrendDown: Story = { name: 'Trend Down', args: { ...revenue, value: 7215400, trend: -12.5 }, decorators: wide }
export const NoChange: Story = { name: 'No Change', args: { ...revenue, trend: 0 }, decorators: wide }
export const WithTags: Story = {
  name: 'With Tags',
  args: { title: 'Số hoá đơn điện tử', value: 900, description: undefined, icon: <FileCheck02Line />, color: 'magenta', extra: <><Tag>Chanhdev</Tag><Tag>+5</Tag></> },
}
export const Loading: Story = { args: { loading: true } }
export const LoadingPrimary: Story = { name: 'Loading (Primary)', args: { ...revenue, loading: true }, decorators: wide }
export const Empty: Story = { args: { value: null } }
export const ErrorState: Story = { name: 'Error', args: { value: undefined, error: 'Không tải được dữ liệu', onRetry: fn() } }
export const ErrorPrimary: Story = { name: 'Error (Primary)', args: { ...revenue, value: undefined, error: 'Không tải được dữ liệu', onRetry: fn() }, decorators: wide }
export const Clickable: Story = { args: { onClick: fn() } }
