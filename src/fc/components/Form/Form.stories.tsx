import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type FormEvent } from 'react'
import { Lock01, Plus, User01 } from '../../../icons'
import { Alert } from '../Alert/Alert'
import { Button } from '../Button/Button'
import { Card } from '../Card/Card'
import { Checkbox, CheckboxGroup } from '../Checkbox/Checkbox'
import { Flex } from '../Flex/Flex'
import { Col, Row } from '../Grid/Grid'
import { TextArea, TextField } from '../Input/Input'
import { SearchField } from '../Input/SearchField'
import { InputNumber } from '../InputNumber/InputNumber'
import { Radio, RadioGroup } from '../Radio/Radio'
import { Select, type SelectOption } from '../Select/Select'
import { Switch } from '../Switch/Switch'
import { Text } from '../Typography/Typography'
import { Form, FormItem, type FormProps } from './Form'

const CATEGORIES: SelectOption[] = [
  { key: 'main', label: 'Món chính' },
  { key: 'starter', label: 'Khai vị' },
  { key: 'drink', label: 'Đồ uống' },
  { key: 'dessert', label: 'Tráng miệng' },
]

const TYPES: SelectOption[] = [
  { key: 'restaurant', label: 'Nhà hàng' },
  { key: 'cafe', label: 'Quán cà phê' },
  { key: 'milk-tea', label: 'Trà sữa' },
  { key: 'pub', label: 'Quán nhậu' },
  { key: 'kitchen', label: 'Bếp trung tâm' },
]

const CITIES: SelectOption[] = [
  { key: 'hn', label: 'Hà Nội' },
  { key: 'hcm', label: 'TP. Hồ Chí Minh' },
  { key: 'dn', label: 'Đà Nẵng' },
  { key: 'hp', label: 'Hải Phòng' },
  { key: 'ct', label: 'Cần Thơ' },
]

const CHAINS: SelectOption[] = [
  { key: 'pho-co', label: 'Phở Cồ' },
  { key: 'bun-cha', label: 'Bún chả Hương Liên' },
  { key: 'com-tam', label: 'Cơm tấm Cali' },
  { key: 'tra-sua', label: 'Trà sữa Mây' },
]

const noSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault()

/**
 * The Figma field list (`Form / Form Item / Vertical` and `/ Horizontal` Type),
 * in its order, with the fields that exist today: Text, Password, Phone,
 * Textarea, Select (with Tooltip), InputNumber, Switch, Currency, Radio
 * Buttons, Radio Group, Checkbox Group, the dashed "Add field" button, the
 * agreement checkbox and the actions. Fields with their own `label` get the
 * form label directly; groups, switches and buttons go in a `FormItem`.
 */
function FieldTypes() {
  return (
    <>
      <TextField name="name" label="Tên món" isRequired placeholder="Nhập tên món" />
      <TextField name="pin" label="Mã PIN quản lý" type="password" revealable isRequired placeholder="Nhập mã PIN" />
      <TextField name="phone" label="Số điện thoại bếp" type="tel" addonBefore="+84" isRequired placeholder="912 345 678" />
      <TextArea name="note" label="Ghi chú cho bếp" placeholder="Ví dụ: ít cay, không hành" rows={2} />
      <FormItem label="Danh mục" tooltip="Món nằm trong danh mục này trên màn hình order" isRequired>
        <Select name="category" options={CATEGORIES} placeholder="Chọn danh mục" />
      </FormItem>
      <InputNumber name="portion" label="Định lượng" suffix="gram" minValue={0} step={50} defaultValue={250} />
      <FormItem label="Đang bán">
        <Switch name="active" defaultSelected />
      </FormItem>
      <InputNumber name="price" label="Giá bán" formatOptions={{ style: 'currency', currency: 'VND' }} step={1000} minValue={0} defaultValue={45000} block />
      <FormItem label="Hiển thị trên POS">
        <RadioGroup name="display" appearance="button" defaultValue="grid">
          <Radio value="grid">Lưới</Radio>
          <Radio value="list">Danh sách</Radio>
          <Radio value="compact">Thu gọn</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="Loại món">
        <RadioGroup name="kind" defaultValue="food">
          <Radio value="food">Đồ ăn</Radio>
          <Radio value="drink">Đồ uống</Radio>
          <Radio value="combo">Combo</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="Bán tại">
        <CheckboxGroup name="channels" defaultValue={['dine-in']}>
          <Checkbox value="dine-in">Tại chỗ</Checkbox>
          <Checkbox value="takeaway">Mang về</Checkbox>
          <Checkbox value="delivery">Giao hàng</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem>
        <Button variant="dashed" block iconStart={<Plus />}>Thêm tùy chọn món</Button>
      </FormItem>
      <FormItem>
        <Checkbox name="checked" value="yes">Tôi đã kiểm tra giá và thuế</Checkbox>
      </FormItem>
      <FormItem>
        <Flex gap="xs">
          <Button type="submit" variant="primary">Lưu món</Button>
          <Button type="reset">Hủy</Button>
        </Flex>
      </FormItem>
    </>
  )
}

const meta = {
  title: 'Components/Form',
  component: Form,
  args: { layout: 'vertical', size: 'md', requiredMark: true, colon: true, labelAlign: 'end' },
  argTypes: {
    layout: { control: 'inline-radio', options: ['vertical', 'horizontal', 'inline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    requiredMark: { control: 'inline-radio', options: [true, 'optional', false] },
    labelAlign: { control: 'inline-radio', options: ['start', 'end'] },
    labelWidth: { control: 'number' },
    children: { control: false },
  },
  render: (args) => (
    <div style={{ maxWidth: args.layout === 'horizontal' ? 640 : 480 }}>
      <Form {...args} aria-label="Thêm món" onSubmit={noSubmit}>
        <FieldTypes />
      </Form>
    </div>
  ),
} satisfies Meta<typeof Form>
export default meta
type Story = StoryObj<typeof meta>

/** Figma `Form / Basic` Layout=Vertical, Size=Default — the "vertical items" example. */
export const Vertical: Story = {}

/** Figma Layout=Horizontal: labels in a column on the left (right-aligned, with a colon), fields and actions in the right column. */
export const Horizontal: Story = { args: { layout: 'horizontal', labelWidth: 160 } }

/**
 * Figma Layout=Inline: label + field pairs, a checkbox and the actions on one
 * row, wrapping when narrow. A filter bar over the dish list.
 */
export const Inline: Story = {
  args: { layout: 'inline' },
  render: (args) => (
    <Form {...args} aria-label="Lọc món" onSubmit={noSubmit}>
      <TextField name="q" label="Tên món" isRequired placeholder="Nhập tên món" />
      <div style={{ width: 200 }}>
        <Select name="category" label="Danh mục" options={CATEGORIES} placeholder="Tất cả" />
      </div>
      <FormItem>
        <Checkbox name="onSale" value="yes" defaultSelected>Chỉ món đang bán</Checkbox>
      </FormItem>
      <FormItem>
        <Flex gap="xs">
          <Button type="reset">Đặt lại</Button>
          <Button type="submit" variant="primary">Tìm kiếm</Button>
        </Flex>
      </FormItem>
    </Form>
  ),
}

/**
 * Figma Size: Small / Default / Large. `<Form size>` reaches every field left
 * at the default size and the label height; buttons keep their own `size`.
 */
export const Sizes: Story = {
  args: { layout: 'horizontal' },
  render: (args) => (
    <Flex direction="column" gap="xl" style={{ maxWidth: 560 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Flex key={size} direction="column" gap="sm">
          <Text strong>{{ sm: 'Small', md: 'Default', lg: 'Large' }[size]}</Text>
          <Form {...args} size={size} aria-label={`Thông tin nhà hàng, cỡ ${size}`} onSubmit={noSubmit}>
            <TextField name="name" label="Tên nhà hàng" isRequired defaultValue="Phở Cồ Hà Nội" />
            <Select name="type" label="Loại hình" options={TYPES} defaultValue="restaurant" />
            <InputNumber name="tables" label="Số bàn" defaultValue={24} minValue={0} />
            <SearchField name="dish" label="Món đặc trưng" placeholder="Tìm món" />
          </Form>
        </Flex>
      ))}
    </Flex>
  ),
}

/**
 * Figma `Form Label` Mark: Required (*), Optional ("(không bắt buộc)") and
 * None, with Tooltip=True on "Danh mục" and "Thời gian chế biến". The field
 * stays required for validation and assistive tech whatever the mark.
 */
export const RequiredMarks: Story = {
  render: (args) => (
    <Flex gap="xl" wrap align="start">
      {([true, 'optional', false] as const).map((mark) => (
        <Flex key={String(mark)} direction="column" gap="sm" style={{ width: 300 }}>
          <Text strong>requiredMark={JSON.stringify(mark)}</Text>
          <Form {...args} requiredMark={mark} aria-label={`Món mới, dấu ${String(mark)}`} onSubmit={noSubmit}>
            <TextField name="name" label="Tên món" isRequired placeholder="Nhập tên món" />
            <TextField name="kitchenName" label="Tên in trên phiếu bếp" placeholder="Mặc định: tên món" />
            <FormItem label="Danh mục" tooltip="Món nằm trong danh mục này trên màn hình order" isRequired>
              <Select name="category" options={CATEGORIES} placeholder="Chọn danh mục" />
            </FormItem>
            <InputNumber name="prep" label="Thời gian chế biến" tooltip="Bếp dùng để sắp thứ tự ra món" suffix="phút" minValue={0} defaultValue={10} />
          </Form>
        </Flex>
      ))}
    </Flex>
  ),
}

function ValidationDemo(args: FormProps) {
  const [saved, setSaved] = useState<string | null>(null)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaved(String(new FormData(e.currentTarget).get('name')))
  }
  return (
    <div style={{ maxWidth: 480 }}>
      <Form {...args} aria-label="Thông tin nhà hàng" onSubmit={submit} onReset={() => setSaved(null)}>
        <TextField name="name" label="Tên nhà hàng" isRequired placeholder="Ví dụ: Phở Cồ Hà Nội" />
        <TextField
          name="code"
          label="Mã cửa hàng"
          isRequired
          description="2–6 chữ in hoa hoặc số, ví dụ HN01"
          validate={(v) => (v && !/^[A-Z0-9]{2,6}$/.test(v) ? 'Mã cửa hàng chỉ gồm 2–6 chữ in hoa hoặc số' : null)}
        />
        <TextField name="email" type="email" label="Email nhận báo cáo" isRequired placeholder="quanly@nhahang.vn" />
        <TextField
          name="phone"
          type="tel"
          label="Số điện thoại"
          addonBefore="+84"
          isRequired
          validate={(v) => (v && !/^\d{9}$/.test(v.replace(/\s/g, '')) ? 'Số điện thoại gồm 9 chữ số sau +84' : null)}
        />
        <Select name="type" label="Loại hình" options={TYPES} isRequired placeholder="Chọn loại hình" />
        <InputNumber
          name="tables"
          label="Số bàn"
          isRequired
          minValue={1}
          maxValue={200}
          commitBehavior="validate"
          description="Từ 1 đến 200 bàn"
        />
        <FormItem>
          <CheckboxGroup name="terms" aria-label="Điều khoản" isRequired errorMessage="Vui lòng đồng ý với điều khoản sử dụng">
            <Checkbox value="accepted">Tôi đồng ý với điều khoản sử dụng FABi CMS</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem>
          <Flex gap="xs">
            <Button type="submit" variant="primary">Lưu</Button>
            <Button type="reset">Nhập lại</Button>
          </Flex>
        </FormItem>
        {saved != null && <Alert type="success" title={`Đã lưu nhà hàng "${saved}"`} />}
      </Form>
    </div>
  )
}

/**
 * Native validation on submit: press "Lưu" with the form empty. Errors show
 * under each field in Vietnamese — built-in checks (required, email, range)
 * get the fc text, `validate` returns its own — and focus moves to the first
 * invalid field. Each error clears as the field is corrected.
 */
export const ValidationOnSubmit: Story = { render: (args) => <ValidationDemo {...args} /> }

function ServerErrorsDemo(args: FormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pending, setPending] = useState(false)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)
    // Stands in for the server's answer — no network call.
    window.setTimeout(() => {
      setPending(false)
      setErrors({
        code: 'Mã HN01 đã dùng cho chi nhánh Hoàn Kiếm',
        phone: 'Số điện thoại này đã đăng ký cho một cửa hàng khác',
        hours: 'Giờ đóng cửa phải sau giờ mở cửa',
      })
    }, 600)
  }
  return (
    <div style={{ maxWidth: 480 }}>
      <Form {...args} aria-label="Sửa chi nhánh" validationErrors={errors} onSubmit={submit}>
        <TextField name="code" label="Mã cửa hàng" defaultValue="HN01" isRequired />
        <TextField name="phone" type="tel" label="Số điện thoại" addonBefore="+84" defaultValue="912345678" isRequired />
        <FormItem name="hours" label="Giờ mở cửa" description="Theo giờ Việt Nam (GMT+7)">
          <Flex gap="xs" align="center">
            <InputNumber name="open" aria-label="Mở cửa lúc" defaultValue={22} minValue={0} maxValue={23} suffix="giờ" />
            <Text>đến</Text>
            <InputNumber name="close" aria-label="Đóng cửa lúc" defaultValue={10} minValue={0} maxValue={23} suffix="giờ" />
          </Flex>
        </FormItem>
        <FormItem>
          <Button type="submit" variant="primary" isPending={pending}>Lưu thay đổi</Button>
        </FormItem>
      </Form>
    </div>
  )
}

/**
 * Server errors: press "Lưu thay đổi". The (simulated) server answer goes to
 * `validationErrors` by field `name`; each field shows its message until the
 * user edits it. `FormItem name="hours"` shows the error for a group of two
 * controls and marks both invalid.
 */
export const ServerErrors: Story = { render: (args) => <ServerErrorsDemo {...args} /> }

function CreateRestaurantDemo(args: FormProps) {
  const [created, setCreated] = useState<string | null>(null)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCreated(String(new FormData(e.currentTarget).get('name')))
  }
  return (
    <div style={{ maxWidth: 800 }}>
      <Card title="Tạo nhà hàng">
        <Form {...args} aria-label="Tạo nhà hàng" onSubmit={submit} onReset={() => setCreated(null)}>
          <Row gap="base">
            <Col md={16}>
              <TextField name="name" label="Tên nhà hàng" isRequired maxLength={100} showCount placeholder="Ví dụ: Phở Cồ Hà Nội" />
            </Col>
            <Col md={8}>
              <TextField name="code" label="Mã cửa hàng" isRequired placeholder="HN01" description="In trên hóa đơn và báo cáo" />
            </Col>
          </Row>
          <Row gap="base">
            <Col md={12}>
              <Select name="type" label="Loại hình kinh doanh" options={TYPES} isRequired placeholder="Chọn loại hình" />
            </Col>
            <Col md={12}>
              <Select name="chain" label="Thuộc chuỗi" options={CHAINS} showSearch allowClear placeholder="Tìm chuỗi" />
            </Col>
          </Row>
          <Row gap="base">
            <Col md={12}>
              <TextField name="phone" type="tel" label="Số điện thoại" addonBefore="+84" isRequired placeholder="912 345 678" />
            </Col>
            <Col md={12}>
              <TextField name="email" type="email" label="Email" placeholder="quanly@nhahang.vn" />
            </Col>
          </Row>
          <Row gap="base">
            <Col md={8}>
              <Select name="city" label="Tỉnh / Thành phố" options={CITIES} isRequired placeholder="Chọn tỉnh / thành" />
            </Col>
            <Col md={16}>
              <TextField name="address" label="Địa chỉ" isRequired placeholder="Số nhà, đường, phường / xã" />
            </Col>
          </Row>
          <Row gap="base">
            <Col span={12} md={8}>
              <InputNumber name="tables" label="Số bàn" minValue={0} maxValue={500} defaultValue={20} block />
            </Col>
            <Col span={12} md={8}>
              <InputNumber
                name="avgSpend"
                label="Chi tiêu trung bình / khách"
                tooltip="Dùng để gợi ý combo và khuyến mãi"
                formatOptions={{ style: 'currency', currency: 'VND' }}
                step={10000}
                minValue={0}
                defaultValue={120000}
                block
              />
            </Col>
            <Col md={8}>
              <InputNumber name="vat" label="Thuế VAT" formatOptions={{ style: 'percent' }} step={0.01} minValue={0} maxValue={0.1} defaultValue={0.08} block />
            </Col>
          </Row>
          <FormItem label="Hình thức phục vụ" isRequired>
            <CheckboxGroup name="services" defaultValue={['dine-in']}>
              <Checkbox value="dine-in">Tại chỗ</Checkbox>
              <Checkbox value="takeaway">Mang về</Checkbox>
              <Checkbox value="delivery">Giao hàng</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="Cách gọi món">
            <RadioGroup name="ordering" appearance="button" defaultValue="table">
              <Radio value="table">Order tại bàn</Radio>
              <Radio value="counter">Order tại quầy</Radio>
              <Radio value="qr">Khách tự order (QR)</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="Mở bán online" tooltip="Hiện nhà hàng trên kênh đặt món FABi Online">
            <Switch name="online" />
          </FormItem>
          <TextArea name="intro" label="Giới thiệu" placeholder="Món đặc trưng, không gian, giờ phục vụ…" rows={3} maxLength={500} showCount />
          <FormItem>
            <CheckboxGroup name="terms" aria-label="Điều khoản" isRequired errorMessage="Vui lòng đồng ý với điều khoản trước khi tạo">
              <Checkbox value="accepted">Tôi đồng ý với điều khoản sử dụng dịch vụ FABi CMS</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <Flex gap="xs" justify="end">
            <Button type="reset">Hủy</Button>
            <Button type="submit" variant="primary">Tạo nhà hàng</Button>
          </Flex>
          {created != null && <Alert type="success" title={`Đã tạo nhà hàng "${created}"`} />}
        </Form>
      </Card>
    </div>
  )
}

/**
 * A real screen: "Tạo nhà hàng" in a Card — text, phone (addon), email,
 * select, searchable select, integer, currency (VND) and percent numbers,
 * checkbox group, radio buttons, switch with tooltip, textarea with count
 * and a required agreement. Two-column rows use Row / Col inside the form.
 */
export const CreateRestaurant: Story = { render: (args) => <CreateRestaurantDemo {...args} /> }

function LoginDemo({ stacked }: { stacked: boolean }) {
  return (
    <div style={{ maxWidth: 370 }}>
      <Form size="lg" requiredMark={false} aria-label="Đăng nhập" onSubmit={noSubmit}>
        <Flex direction="column" gap="lg">
          <Flex direction="column" gap="sm">
            <TextField name="username" label="Tài khoản" placeholder="Nhập tài khoản" autoComplete="username" isRequired />
            <TextField name="password" label="Mật khẩu" type="password" revealable placeholder="Nhập mật khẩu" autoComplete="current-password" isRequired />
          </Flex>
          <Flex direction="column" gap="base">
            <Flex direction={stacked ? 'column' : 'row'} gap="sm">
              <Button size="lg" block>Đăng nhập bằng mã</Button>
              <Button size="lg" variant="primary" type="submit" block>Đăng nhập</Button>
            </Flex>
            <Flex direction="column" gap="xs" align="center">
              <Flex gap="xxs" align="center" wrap justify="center">
                <Text tone="secondary">Bạn chưa có tài khoản hệ thống iPOS?</Text>
                <Button variant="link" size="sm">Đăng ký</Button>
              </Flex>
              <Button variant="link" size="sm">Quên mật khẩu</Button>
            </Flex>
          </Flex>
        </Flex>
      </Form>
    </div>
  )
}

/** Figma `Form / Login` MD=MD: large fields, the two buttons side by side. */
export const Login: Story = { render: () => <LoginDemo stacked={false} /> }

/** Figma `Form / Login` MD=SM: the narrow version, buttons stacked full width. */
export const LoginNarrow: Story = { render: () => <LoginDemo stacked /> }

/** The Figma "inline login" example: fields without visible labels on one row (named by `aria-label`). */
export const InlineLogin: Story = {
  render: () => (
    <Form layout="inline" requiredMark={false} aria-label="Đăng nhập nhanh" onSubmit={noSubmit}>
      <TextField name="username" aria-label="Tài khoản" placeholder="Tài khoản" prefix={<User01 />} isRequired />
      <TextField name="password" aria-label="Mật khẩu" type="password" revealable placeholder="Mật khẩu" prefix={<Lock01 />} isRequired />
      <Button type="submit" variant="primary">Đăng nhập</Button>
    </Form>
  ),
}
