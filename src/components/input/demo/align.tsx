import React from 'react';
import {
  AutoComplete,
  Button,
  Cascader,
  DatePicker,
  Input,
  InputNumber,
  Mentions,
  Radio,
  Select,
  TimePicker,
  TreeSelect,
  Typography,
} from '@fabi/ui';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const narrowStyle: React.CSSProperties = {
  width: 50,
};

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const selectOptions = [
  { value: 'jack', label: 'Jack' },
  { value: 'lucy', label: 'Lucy' },
];

const App: React.FC = () => (
  <>
    <Mentions aria-label="Mention" style={{ width: 100 }} rows={1} />
    <Input.TextArea aria-label="Text" rows={1} style={{ width: 100 }} />
    <Button type="primary">Button</Button>
    <Input aria-label="Input" style={{ width: 100 }} />
    <Text copyable>FABi CMS</Text>
    <Input aria-label="Input" prefix="1" suffix="2" style={{ width: 100 }} />
    <Input aria-label="Input" addonBefore="1" addonAfter="2" style={{ width: 100 }} />
    <InputNumber aria-label="Number" style={{ width: 100 }} />
    <DatePicker aria-label="Date" style={{ width: 100 }} />
    <TimePicker aria-label="Time" style={{ width: 100 }} />
    <Select aria-label="Select" style={{ width: 100 }} defaultValue="jack" options={selectOptions} />
    <Select aria-label="Select" style={{ width: 100 }} defaultValue="" options={selectOptions} />
    <Select aria-label="Select" style={{ width: 100 }} options={selectOptions} />
    <TreeSelect aria-label="Select" style={{ width: 100 }} />
    <Cascader aria-label="Select" defaultValue={['zhejiang', 'hangzhou', 'xihu']} options={options} />
    <RangePicker aria-label="Date range" />
    <DatePicker aria-label="Date" picker="month" />
    <Radio.Group defaultValue="a">
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b">Shanghai</Radio.Button>
    </Radio.Group>
    <AutoComplete aria-label="input here" style={{ width: 100 }} placeholder="input here" />
    <br />
    <Input aria-label="Input" prefix="$" addonBefore="Http://" addonAfter=".com" defaultValue="mysite" />
    <Input aria-label="Input" style={narrowStyle} suffix="Y" />
    <Input aria-label="Input" style={narrowStyle} />
    <Input aria-label="Input" style={narrowStyle} defaultValue="1" suffix="Y" />
  </>
);

export default App;
