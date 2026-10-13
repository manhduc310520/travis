// FABi's own component (not converted from antd): packages/fabi-ui/src/StatisticCard.tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Col, Row, StatisticCard, Tag } from '@fabi/ui'
import type { StatisticCardProps } from '@fabi/ui'
import { File06Line, FileCheck02Line, Percent03Line, Users01Line } from '@fabi/ui/fabi-icons'
import { fn } from 'storybook/test'

// Sample texts in the docs language (Language toolbar). The args hold no text, so the Controls table reads the
// same in both languages; text typed in the Controls replaces the sample.
const TEXT = {
  vi: {
    invoices: 'Tổng hoá đơn', perInvoice: 'Trung bình 160.266 ₫ / hoá đơn', revenue: 'Doanh thu (Gross)',
    comparison: 'so với Từ ngày 01/05 đến ngày 31/05', discounts: 'Giảm giá và chi phí', customers: 'Số khách',
    perCustomer: 'Trung bình 20.000 ₫ / khách', einvoices: 'Số hoá đơn điện tử', error: 'Không tải được dữ liệu',
  },
  en: {
    invoices: 'Total invoices', perInvoice: 'Average 160.266 ₫ per invoice', revenue: 'Revenue (gross)',
    comparison: 'vs. 01/05 – 31/05', discounts: 'Discounts and costs', customers: 'Customers',
    perCustomer: 'Average 20.000 ₫ per customer', einvoices: 'E-invoices', error: 'Could not load the data',
  },
}
type Texts = (typeof TEXT)['vi']
/** Which sample a story shows (parameters.sample) */
const SAMPLES = {
  invoices: (t: Texts) => ({ title: t.invoices, description: t.perInvoice }),
  revenue: (t: Texts) => ({ title: t.revenue, comparison: t.comparison }),
  einvoices: (t: Texts) => ({ title: t.einvoices }),
}
const lang = (locale: unknown) => (locale === 'vi' ? 'vi' : 'en')

const meta: Meta<typeof StatisticCard> = {
  title: 'Components/Data Display/Statistic Card',
  component: StatisticCard,
  tags: ['autodocs'],
  args: { value: 60, icon: <File06Line />, color: 'orange' },
  argTypes: {
    type: { control: 'inline-radio', options: ['default', 'primary'] },
    icon: { control: false },
    extra: { control: false },
    onClick: { control: false },
    onRetry: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
  render: (args, { globals, parameters }) => {
    const t = TEXT[lang(globals.locale)]
    const sample: StatisticCardProps = SAMPLES[(parameters.sample as keyof typeof SAMPLES) ?? 'invoices'](t)
    return <StatisticCard {...sample} {...(parameters.error && { error: t.error })} {...args} />
  },
}
export default meta
type Story = StoryObj<typeof StatisticCard>

const revenue = { type: 'primary' as const, value: 9615933, suffix: '₫', trend: 8, icon: undefined }
const wide: Story['decorators'] = [(Story) => <div style={{ maxWidth: 'none' }}><Story /></div>]

export const Default: Story = {}
export const Primary: Story = { args: revenue, decorators: wide, parameters: { sample: 'revenue' } }

/** The dashboard: one component, the headline figure on the brand surface and four category colours */
export const Dashboard: Story = {
  decorators: wide,
  render: (_, { globals }) => {
    const t = TEXT[lang(globals.locale)]
    return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <StatisticCard {...revenue} {...SAMPLES.revenue(t)} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatisticCard title={t.discounts} value={1500000} suffix="₫" description={t.perInvoice} icon={<Percent03Line />} color="blue" />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatisticCard title={t.invoices} value={60} description={t.perInvoice} icon={<File06Line />} color="orange" />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatisticCard title={t.customers} value={23} description={t.perCustomer} icon={<Users01Line />} color="green" />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatisticCard title={t.einvoices} value={900} icon={<FileCheck02Line />} color="magenta" extra={<><Tag>Chanhdev</Tag><Tag>+5</Tag></>} />
        </Col>
      </Row>
    )
  },
}

export const TrendDown: Story = { name: 'Trend Down', args: { ...revenue, value: 7215400, trend: -12.5 }, decorators: wide, parameters: { sample: 'revenue' } }
export const NoChange: Story = { name: 'No Change', args: { ...revenue, trend: 0 }, decorators: wide, parameters: { sample: 'revenue' } }
export const WithTags: Story = {
  name: 'With Tags',
  args: { value: 900, icon: <FileCheck02Line />, color: 'magenta', extra: <><Tag>Chanhdev</Tag><Tag>+5</Tag></> },
  parameters: { sample: 'einvoices' },
}
export const Loading: Story = { args: { loading: true } }
export const LoadingPrimary: Story = { name: 'Loading (Primary)', args: { ...revenue, loading: true }, decorators: wide, parameters: { sample: 'revenue' } }
export const Empty: Story = { args: { value: null } }
export const ErrorState: Story = { name: 'Error', args: { value: undefined, onRetry: fn() }, parameters: { error: true } }
export const ErrorPrimary: Story = { name: 'Error (Primary)', args: { ...revenue, value: undefined, onRetry: fn() }, decorators: wide, parameters: { sample: 'revenue', error: true } }
export const Clickable: Story = { args: { onClick: fn() } }
