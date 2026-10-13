import React, { useState } from 'react';
import type { CascaderProps } from '@fabi/ui';
import { Cascader } from '@fabi/ui';

interface Option {
  value?: string | number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
}

const optionLists: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    isLeaf: false,
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    isLeaf: false,
  },
];

const App: React.FC = () => {
  const [options, setOptions] = useState<Option[]>(optionLists);

  const onChange: CascaderProps<Option>['onChange'] = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  const loadData = (selectedOptions: Option[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    // load options lazily
    setTimeout(() => {
      targetOption.children = [
        {
          label: `${targetOption.label} Dynamic 1`,
          value: 'dynamic1',
        },
        {
          label: `${targetOption.label} Dynamic 2`,
          value: 'dynamic2',
        },
      ];
      setOptions([...options]);
    }, 1000);
  };

  return <Cascader aria-label="Select" options={options} loadData={loadData} onChange={onChange} changeOnSelect />;
};

export default App;
