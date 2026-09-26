import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { HelpCircle } from '../../../icons'
import { Button } from '../Button/Button'
import { Tooltip } from '../Tooltip/Tooltip'
import { Checkbox, CheckboxGroup } from './Checkbox'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { children: 'Nhận thông báo qua email', isDisabled: false, isIndeterminate: false, isInvalid: false },
} satisfies Meta<typeof Checkbox>
export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--fc-space-margin-sm)' } as const

export const Playground: Story = {}

export const States: Story = {
  render: () => (
    <div style={stack}>
      <Checkbox>Chưa chọn</Checkbox>
      <Checkbox defaultSelected>Đã chọn</Checkbox>
      <Checkbox isIndeterminate>Chọn một phần</Checkbox>
      <Checkbox isInvalid>Cần đồng ý điều khoản</Checkbox>
      <Checkbox isDisabled>Không khả dụng</Checkbox>
      <Checkbox isDisabled defaultSelected>Không khả dụng, đã chọn</Checkbox>
      <Checkbox isDisabled isIndeterminate>Không khả dụng, một phần</Checkbox>
    </div>
  ),
}

const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']

function SelectAllDemo() {
  const [selected, setSelected] = useState<string[]>(['Thứ 2', 'Thứ 3'])
  const all = selected.length === DAYS.length
  return (
    <div style={stack}>
      <Checkbox
        isSelected={all}
        isIndeterminate={selected.length > 0 && !all}
        onChange={(on) => setSelected(on ? DAYS : [])}
      >
        Cả tuần
      </Checkbox>
      <CheckboxGroup aria-label="Ngày mở cửa" value={selected} onChange={setSelected}>
        {DAYS.map((d) => <Checkbox key={d} value={d}>{d}</Checkbox>)}
      </CheckboxGroup>
    </div>
  )
}

export const SelectAll: Story = { render: () => <SelectAllDemo /> }

export const Group: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--fc-space-margin-lg)' }}>
      <CheckboxGroup label="Kênh bán hàng" defaultValue={['tai-quan']} description="Chọn ít nhất một kênh.">
        <Checkbox value="tai-quan">Tại quán</Checkbox>
        <Checkbox value="mang-ve">Mang về</Checkbox>
        <Checkbox value="giao-hang">Giao hàng</Checkbox>
      </CheckboxGroup>
      <CheckboxGroup label="Phương thức thanh toán" orientation="vertical" isInvalid errorMessage="Chọn ít nhất một phương thức.">
        <Checkbox value="tien-mat">Tiền mặt</Checkbox>
        <Checkbox value="the">Thẻ ngân hàng</Checkbox>
        <Checkbox value="vi">Ví điện tử</Checkbox>
      </CheckboxGroup>
    </div>
  ),
}

/** Figma Label=false: the box alone still needs an accessible name. */
export const WithoutLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--fc-space-margin-base)' }}>
      <Checkbox aria-label="Chọn đơn DH-1024" />
      <Checkbox aria-label="Chọn đơn DH-1025" defaultSelected />
      <Checkbox aria-label="Chọn tất cả" isIndeterminate />
      <Checkbox aria-label="Chọn đơn DH-1026" isDisabled />
    </div>
  ),
}

/**
 * Figma Tooltip=true: a help button next to the label. It sits outside the
 * label — anything inside the label toggles the checkbox when pressed.
 */
export const WithTooltip: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fc-space-margin-xxs)', padding: 'var(--fc-space-padding-xl)' }}>
      <Checkbox>Tự động in hóa đơn</Checkbox>
      <Tooltip content="In ngay khi thanh toán xong, không cần bấm In.">
        <Button variant="text" size="sm" shape="circle" aria-label="Giải thích: tự động in hóa đơn" iconStart={<HelpCircle />} />
      </Tooltip>
    </div>
  ),
}
