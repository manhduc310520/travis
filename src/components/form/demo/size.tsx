import React, { useState } from 'react';
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TreeSelect,
} from '@fabi/ui';
import type { FormProps } from '@fabi/ui';

type SizeType = Parameters<typeof Form>[0]['size'];

const App: React.FC = () => {
  const [componentSize, setComponentSize] = useState<SizeType>('medium');

  const onFormLayoutChange: FormProps<any>['onValuesChange'] = ({ size }) => {
    setComponentSize(size);
  };

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      initialValues={{ size: componentSize }}
      onValuesChange={onFormLayoutChange}
      size={componentSize as SizeType}
      style={{ maxWidth: 600 }}
    >
      <Form.Item label="Form Size" name="size">
        <Radio.Group>
          <Radio.Button value="small">Small</Radio.Button>
          <Radio.Button value="medium">Medium</Radio.Button>
          <Radio.Button value="large">Large</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Input">
        <Input aria-label="Input" />
      </Form.Item>
      <Form.Item label="Select">
        <Select aria-label="Select" options={[{ label: 'Demo', value: 'demo' }]} />
      </Form.Item>
      <Form.Item label="TreeSelect">
        <TreeSelect aria-label="Select"
          treeData={[
            { title: 'Light', value: 'light', children: [{ title: 'Bamboo', value: 'bamboo' }] },
          ]}
        />
      </Form.Item>
      <Form.Item label="Cascader">
        <Cascader aria-label="Select"
          options={[
            {
              value: 'zhejiang',
              label: 'Zhejiang',
              children: [{ value: 'hangzhou', label: 'Hangzhou' }],
            },
          ]}
        />
      </Form.Item>
      <Form.Item label="DatePicker">
        <DatePicker aria-label="Date" />
      </Form.Item>
      <Form.Item label="InputNumber">
        <InputNumber aria-label="Number" />
      </Form.Item>
      <Form.Item label="Switch" valuePropName="checked">
        <Switch aria-label="Switch" />
      </Form.Item>
      <Form.Item label="Button">
        <Button>Button</Button>
      </Form.Item>
    </Form>
  );
};

export default App;
