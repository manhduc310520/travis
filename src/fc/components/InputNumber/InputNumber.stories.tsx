import type { Meta, StoryObj } from '@storybook/react-vite'
import type { FormEvent } from 'react'
import { Coins01, Hash01, Settings01 } from '../../../icons'
import { Button } from '../Button/Button'
import { Form, FormItem } from '../Form/Form'
import { InputNumber } from './InputNumber'

const meta = {
  title: 'Components/InputNumber',
  component: InputNumber,
  args: {
    label: 'Số lượng',
    defaultValue: 3,
    minValue: 0,
    size: 'md',
    variant: 'outlined',
    mode: 'default',
    controls: true,
    block: false,
    isDisabled: false,
    isReadOnly: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outlined', 'filled', 'borderless', 'underlined'] },
    status: { control: 'inline-radio', options: [undefined, 'error', 'warning'] },
    mode: { control: 'inline-radio', options: ['default', 'spinner'] },
    formatOptions: { control: 'object' },
  },
} satisfies Meta<typeof InputNumber>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--fc-space-margin-base)', maxWidth: 320 } as const
const row = { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--fc-space-margin-lg)' } as const

/** Hover or focus the box to show ▲▼; ↑ / ↓ step by `step`, Page Up / Down by more, Home / End jump to min / max. */
export const Playground: Story = {}

/** Figma `InputNumber / Basic` Size: Small / Default / Large. */
export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <InputNumber key={s} {...args} size={s} label={{ sm: 'Small', md: 'Default', lg: 'Large' }[s]} />
      ))}
    </div>
  ),
}

/**
 * Figma `InputNumber / Basic` State: Default (placeholder), Filled, Disabled —
 * plus read-only. Hover / Focused / Typing are live: point at or tab into a field.
 */
export const States: Story = {
  render: (args) => (
    <div style={row}>
      <InputNumber {...args} label="Mặc định" defaultValue={undefined} placeholder="0" />
      <InputNumber {...args} label="Đã nhập" defaultValue={12} />
      <InputNumber {...args} label="Chỉ đọc" defaultValue={12} isReadOnly />
      <InputNumber {...args} label="Vô hiệu" defaultValue={12} isDisabled />
      <InputNumber {...args} label="Không có nút" defaultValue={12} controls={false} />
    </div>
  ),
}

/** Figma `InputNumber / Prefix Suffix` × Status: Default / Error / Warning. */
export const PrefixSuffix: Story = {
  render: (args) => (
    <div style={stack}>
      <InputNumber {...args} label="Tồn kho" prefix={<Hash01 />} suffix="phần" defaultValue={120} block />
      <InputNumber {...args} label="Tồn kho" prefix={<Hash01 />} suffix="phần" defaultValue={-5} block status="error" errorMessage="Tồn kho không được âm" />
      <InputNumber {...args} label="Tồn kho" prefix={<Hash01 />} suffix="phần" defaultValue={4} block status="warning" description="Sắp hết — dưới mức tối thiểu 10 phần" />
    </div>
  ),
}

/** Figma `InputNumber / Pre Post Tab`: pre + post, post only, pre only; text and icon tabs; small and large. */
export const PrePostTab: Story = {
  render: (args) => (
    <div style={stack}>
      <InputNumber {...args} aria-label="Phụ thu" label={undefined} addonBefore="+" addonAfter="₫" defaultValue={5000} step={1000} />
      <InputNumber {...args} aria-label="Giá mỗi phần" label={undefined} addonAfter="₫ / phần" defaultValue={45000} step={1000} />
      <InputNumber {...args} aria-label="Giảm giá" label={undefined} addonBefore="Giảm" defaultValue={10} />
      <InputNumber {...args} aria-label="Điểm thưởng" label={undefined} addonBefore={<Coins01 />} addonAfter={<Settings01 />} defaultValue={200} />
      <InputNumber {...args} aria-label="Phụ thu, cỡ nhỏ" label={undefined} size="sm" addonBefore="+" addonAfter="₫" defaultValue={5000} step={1000} />
      <InputNumber {...args} aria-label="Phụ thu, cỡ lớn" label={undefined} size="lg" addonBefore="+" addonAfter="₫" defaultValue={5000} step={1000} block />
    </div>
  ),
}

/** Figma `InputNumber / Underlined`, `/ Borderless` and `/ Filled` (the Outlined box is `Basic`). */
export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      {(['outlined', 'filled', 'borderless', 'underlined'] as const).map((v) => (
        <InputNumber key={v} {...args} variant={v} label={v} suffix="bàn" defaultValue={12} />
      ))}
    </div>
  ),
}

/** Figma `InputNumber / Filled` Status: Default / Error / Warning. */
export const FilledStatus: Story = {
  render: (args) => (
    <div style={row}>
      <InputNumber {...args} variant="filled" label="Mặc định" defaultValue={12} />
      <InputNumber {...args} variant="filled" label="Lỗi" defaultValue={0} status="error" errorMessage="Tối thiểu 1" />
      <InputNumber {...args} variant="filled" label="Cảnh báo" defaultValue={2} status="warning" />
    </div>
  ),
}

/** Figma `InputNumber / Spinner` Type: Outlined / Filled × Size; the − button disables at `minValue`. */
export const Spinner: Story = {
  render: (args) => (
    <div style={stack}>
      {(['outlined', 'filled'] as const).map((v) => (
        <div key={v} style={row}>
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <InputNumber key={s} {...args} mode="spinner" variant={v} size={s} aria-label={`Số khách, ${v}, cỡ ${s}`} label={undefined} defaultValue={s === 'sm' ? 0 : 3} maxValue={20} />
          ))}
        </div>
      ))}
      <InputNumber {...args} mode="spinner" label="Vô hiệu" defaultValue={3} isDisabled />
    </div>
  ),
}

/**
 * Formatting through `formatOptions`, in the vi-VN locale: decimals
 * ("1.234,5"), a fixed precision, currency ("12.000 ₫"), percent and units.
 * Typing accepts the same format; the value you get is a plain number.
 */
export const Formatting: Story = {
  render: (args) => (
    <div style={stack}>
      <InputNumber {...args} label="Khối lượng nguyên liệu" defaultValue={1234.5} step={0.5} formatOptions={{ maximumFractionDigits: 2 }} block />
      <InputNumber {...args} label="Tỷ giá (2 chữ số thập phân)" defaultValue={25432.1} step={0.01} formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} block />
      <InputNumber {...args} label="Giá bán" defaultValue={12000} step={1000} minValue={0} formatOptions={{ style: 'currency', currency: 'VND' }} block />
      <InputNumber {...args} label="Chiết khấu" defaultValue={0.15} step={0.05} minValue={0} maxValue={1} formatOptions={{ style: 'percent' }} />
      <InputNumber {...args} label="Định lượng" defaultValue={2.5} step={0.1} minValue={0} formatOptions={{ style: 'unit', unit: 'kilogram', maximumFractionDigits: 1 }} />
    </div>
  ),
}

/**
 * `minValue` / `maxValue` / `step`. By default a typed value snaps into range
 * on blur; with `commitBehavior="validate"` it stays and the form reports it
 * on submit (Vietnamese message). Type 250 in the two table-count fields, then press "Kiểm tra" (Check).
 */
export const MinMaxStep: Story = {
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Form aria-label="Sơ đồ bàn" onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}>
        <InputNumber {...args} name="snap" label="Số bàn (tự đưa về 1–200)" minValue={1} maxValue={200} defaultValue={24} />
        <InputNumber {...args} name="validate" label="Số bàn (báo lỗi khi ngoài 1–200)" minValue={1} maxValue={200} defaultValue={24} commitBehavior="validate" isRequired />
        <InputNumber {...args} name="half" label="Suất (bước 0,5)" minValue={0} step={0.5} defaultValue={1.5} />
        <FormItem>
          <Button type="submit" variant="primary">Kiểm tra</Button>
        </FormItem>
      </Form>
    </div>
  ),
}
