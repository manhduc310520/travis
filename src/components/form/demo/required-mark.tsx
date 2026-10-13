import React, { useState } from 'react';
import { InfoCircleOutlined } from '@fabi/ui/icons';
import { Button, Form, Input, Radio, Tag } from '@fabi/ui';
import type { FormProps } from '@fabi/ui';

type RequiredMark = boolean | 'optional' | 'customize';

const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
  <>
    {required ? <Tag color="error">Required</Tag> : <Tag color="warning">optional</Tag>}
    {label}
  </>
);

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMark] = useState<RequiredMark>('optional');

  const onRequiredTypeChange: FormProps<any>['onValuesChange'] = ({ requiredMarkValue }) => {
    setRequiredMark(requiredMarkValue);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ requiredMarkValue: requiredMark }}
      onValuesChange={onRequiredTypeChange}
      requiredMark={requiredMark === 'customize' ? customizeRequiredMark : requiredMark}
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
        <Input aria-label="input placeholder" placeholder="input placeholder" />
      </Form.Item>
      <Form.Item
        label="Field B"
        tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}
      >
        <Input aria-label="input placeholder" placeholder="input placeholder" />
      </Form.Item>
      <Form.Item>
        <Button type="primary">Submit</Button>
      </Form.Item>
    </Form>
  );
};

export default App;
