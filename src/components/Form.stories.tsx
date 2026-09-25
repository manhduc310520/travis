import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Form, Input, InputNumber, Select, Button, Switch, Checkbox, Radio, Segmented, Tag } from 'antd'
import type { FormProps } from 'antd'
import { InfoCircle } from '../icons'

const meta: Meta<typeof Form> = {
  component: Form,
  title: 'Components/Form',
  tags: ['ai-generated', 'needs-work'],
  // Every story uses a custom `render` and none set `args` — the Docs
  // page's argTypes table only renders once at least one arg exists.
  args: { layout: 'vertical' },
  // No JSDoc on `layout` in antd's form/Form.d.ts. Field-level props
  // (`rules`, `validateStatus`, `help`) belong to `Form.Item`, a different
  // component from the one documented here, so they aren't listed as
  // argTypes on this meta.
  argTypes: {
    layout: {
      description: 'Position of labels relative to their fields.',
      control: 'select',
      options: ['horizontal', 'vertical', 'inline'],
    },
  },
}
export default meta
type Story = StoryObj<typeof Form>

/**
 * The Name / Select / Switch / Submit set every plain-vertical-form story
 * below shares — `Vertical`, `Disabled` and `Size` all render the exact same
 * fields, only the surrounding `Form` props change, so this is the one place
 * that set is defined rather than three copies of it drifting apart.
 */
function DemoFields() {
  return (
    <>
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input placeholder="Please input" />
      </Form.Item>
      <Form.Item label="Select" name="select">
        <Select placeholder="Please select" options={[{ value: 'option-1', label: 'Option 1' }, { value: 'option-2', label: 'Option 2' }]} />
      </Form.Item>
      <Form.Item label="Switch" name="switch" valuePropName="checked">
        <Switch defaultChecked />
      </Form.Item>
      <Button type="primary">Submit</Button>
    </>
  )
}
DemoFields.displayName = 'DemoFields'

export const Vertical: Story = {
  render: () => (
    <Form layout="vertical" style={{ maxWidth: 420 }}>
      <DemoFields />
    </Form>
  ),
  parameters: { docs: { source: { code: '() => (\n  <Form layout="vertical">\n    <DemoFields />\n  </Form>\n)' } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Name')).toBeVisible()
  },
}

/**
 * Adapted from antd's own `disabled.tsx` demo — trimmed from its full
 * kitchen-sink control list down to `DemoFields`, since the point here is
 * the `disabled` prop cascading to every field at once, not re-demonstrating
 * every control type Form can wrap.
 */
function DisabledDemo() {
  const [disabled, setDisabled] = useState(true)
  return (
    <>
      <Checkbox checked={disabled} onChange={(e) => setDisabled(e.target.checked)} style={{ marginBottom: 16 }}>
        Form disabled
      </Checkbox>
      <Form layout="vertical" disabled={disabled} style={{ maxWidth: 420 }}>
        <DemoFields />
      </Form>
    </>
  )
}
DisabledDemo.displayName = 'DisabledDemo'

export const Disabled: Story = {
  render: () => <DisabledDemo />,
  parameters: { docs: { source: { code: '() => <DisabledDemo />' } } },
}

/**
 * Adapted from antd's `variant.tsx` demo — `Form`'s own `variant` prop
 * cascades to every field inside it, so switching the Segmented control
 * re-themes the whole form at once. Trimmed the field list to Input /
 * InputNumber / Select, enough to show the variant applies across control
 * types without repeating every one Form supports.
 */
function VariantsDemo() {
  const [form] = Form.useForm()
  const variant = Form.useWatch('variant', form)
  return (
    <Form form={form} layout="vertical" variant={variant || 'outlined'} initialValues={{ variant: 'outlined' }} style={{ maxWidth: 420 }}>
      <Form.Item label="Form variant" name="variant">
        <Segmented options={['outlined', 'filled', 'borderless', 'underlined']} />
      </Form.Item>
      <Form.Item label="Input" name="input">
        <Input placeholder="Please input" />
      </Form.Item>
      <Form.Item label="InputNumber" name="inputNumber">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="Select" name="select">
        <Select placeholder="Please select" options={[{ value: 'option-1', label: 'Option 1' }, { value: 'option-2', label: 'Option 2' }]} />
      </Form.Item>
      <Button type="primary">Submit</Button>
    </Form>
  )
}
VariantsDemo.displayName = 'VariantsDemo'

export const Variants: Story = {
  render: () => <VariantsDemo />,
  parameters: { docs: { source: { code: '() => <VariantsDemo />' } } },
}

/**
 * Adapted from antd's `required-mark.tsx` demo. `requiredMark` defaults to
 * `true` — a red asterisk *before* the label — which is already the
 * behavior every other story here relies on; this just makes the other two
 * built-in options (and a fully custom render) visible and switchable.
 * Swapped the demo's own `InfoCircleOutlined` (from `@ant-design/icons`,
 * a package this project doesn't depend on — see `src/icons.tsx`'s own
 * header comment) for this project's `InfoCircle`.
 */
type RequiredMarkValue = boolean | 'optional' | 'customize'

const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
  <>
    {required ? <Tag color="error">Required</Tag> : <Tag color="warning">Optional</Tag>}
    {label}
  </>
)

function RequiredMarkDemo() {
  const [form] = Form.useForm()
  const [requiredMark, setRequiredMark] = useState<RequiredMarkValue>(true)

  const onValuesChange: FormProps<any>['onValuesChange'] = ({ requiredMarkValue }) => {
    setRequiredMark(requiredMarkValue)
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ requiredMarkValue: requiredMark }}
      onValuesChange={onValuesChange}
      requiredMark={requiredMark === 'customize' ? customizeRequiredMark : requiredMark}
      style={{ maxWidth: 420 }}
    >
      <Form.Item label="Required Mark" name="requiredMarkValue">
        <Radio.Group>
          <Radio.Button value>Default</Radio.Button>
          <Radio.Button value="optional">Optional</Radio.Button>
          <Radio.Button value={false}>Hidden</Radio.Button>
          <Radio.Button value="customize">Customize</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Field A" required tooltip="This is a required field">
        <Input placeholder="Please input" />
      </Form.Item>
      <Form.Item label="Field B" tooltip={{ title: 'Tooltip with a custom icon', icon: <InfoCircle size={14} /> }}>
        <Input placeholder="Please input" />
      </Form.Item>
      <Button type="primary">Submit</Button>
    </Form>
  )
}
RequiredMarkDemo.displayName = 'RequiredMarkDemo'

export const RequiredMark: Story = {
  render: () => <RequiredMarkDemo />,
  parameters: { docs: { source: { code: '() => <RequiredMarkDemo />' } } },
}

/**
 * Adapted from antd's `size.tsx` demo. Note `medium`, not `middle` — this
 * project is on Ant Design v6, where `middle` is deprecated in favor of
 * `medium` (verified against `SizeContext.d.ts`, not guessed).
 */
function SizeDemo() {
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium')
  const onValuesChange: FormProps<any>['onValuesChange'] = (changed) => {
    if (changed.size) setSize(changed.size)
  }
  return (
    <Form layout="vertical" size={size} initialValues={{ size }} onValuesChange={onValuesChange} style={{ maxWidth: 420 }}>
      <Form.Item label="Form Size" name="size">
        <Radio.Group>
          <Radio.Button value="small">Small</Radio.Button>
          <Radio.Button value="medium">Medium</Radio.Button>
          <Radio.Button value="large">Large</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <DemoFields />
    </Form>
  )
}
SizeDemo.displayName = 'SizeDemo'

export const Size: Story = {
  render: () => <SizeDemo />,
  parameters: { docs: { source: { code: '() => <SizeDemo />' } } },
}

/**
 * Adapted from antd's `validate-static.tsx` demo — trimmed from its ~25
 * fields covering every control type down to one field per status, since
 * the point is the four `validateStatus` values themselves (plus the
 * `hasFeedback` icon two of them add), not re-demonstrating every control.
 */
export const ValidateStatus: Story = {
  render: () => (
    <Form layout="vertical" style={{ maxWidth: 420 }}>
      <Form.Item label="Error" validateStatus="error" help="Should be a combination of numbers & letters">
        <Input placeholder="Unavailable choice" />
      </Form.Item>
      <Form.Item label="Warning" validateStatus="warning" help="This value looks unusual">
        <Input defaultValue="abc@" />
      </Form.Item>
      <Form.Item label="Validating" hasFeedback validateStatus="validating" help="The information is being validated…">
        <Input placeholder="Checking…" />
      </Form.Item>
      <Form.Item label="Success" hasFeedback validateStatus="success">
        <Input defaultValue="Looks good" />
      </Form.Item>
    </Form>
  ),
}
