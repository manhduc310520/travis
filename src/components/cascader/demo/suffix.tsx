import React from 'react';
import { SmileOutlined } from '@fabi/ui/icons';
import type { CascaderProps } from '@fabi/ui';
import { Cascader } from '@fabi/ui';

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const options: Option[] = [
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

const onChange: CascaderProps<Option>['onChange'] = (value) => {
  console.log(value);
};

const App: React.FC = () => (
  <>
    <Cascader aria-label="Please select"
      suffixIcon={<SmileOutlined />}
      options={options}
      onChange={onChange}
      placeholder="Please select"
    />
    <br />
    <br />
    <Cascader aria-label="Please select" suffixIcon="ab" options={options} onChange={onChange} placeholder="Please select" />
    <br />
    <br />
    <Cascader aria-label="Please select"
      expandIcon={<SmileOutlined />}
      options={options}
      onChange={onChange}
      placeholder="Please select"
    />
    <br />
    <br />
    <Cascader aria-label="Please select" expandIcon="ab" options={options} onChange={onChange} placeholder="Please select" />
    <br />
    <br />
    <Cascader aria-label="Please select"
      prefix={<SmileOutlined />}
      options={options}
      onChange={onChange}
      placeholder="Please select"
    />
  </>
);

export default App;
