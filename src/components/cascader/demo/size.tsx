import React from 'react';
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
    <Cascader aria-label="Select" size="large" options={options} onChange={onChange} />
    <br />
    <br />
    <Cascader aria-label="Select" options={options} onChange={onChange} />
    <br />
    <br />
    <Cascader aria-label="Select" size="small" options={options} onChange={onChange} />
    <br />
    <br />
  </>
);

export default App;
