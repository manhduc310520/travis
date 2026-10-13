import React from 'react';
import { Cascader, Flex } from '@fabi/ui';
import type { CascaderProps, GetProp } from '@fabi/ui';
import { createStyles } from '@fabi/ui/style';

const useStyles = createStyles(({ token }) => {
  return {
    root: {
      borderRadius: token.borderRadiusLG,
    },
  };
});

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const options: Option[] = [
  {
    value: 'meet-student',
    label: 'meet-student',
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

const stylesObject: CascaderProps['styles'] = {
  prefix: {
    color: '#ccc',
  },
  suffix: {
    color: '#ccc',
  },
};

const stylesFn: CascaderProps['styles'] = (info): GetProp<CascaderProps, 'styles', 'Return'> => {
  if (info.props.variant === 'filled') {
    return {
      prefix: {
        color: '#0958d9',
      },
      suffix: {
        color: '#0958d9',
      },
      popup: {
        listItem: {
          color: '#0958d9',
        },
      },
    };
  }
  return {};
};

const onChange: CascaderProps<Option>['onChange'] = (value) => {
  console.log(value);
};

const App: React.FC = () => {
  const { styles: classNames } = useStyles();
  return (
    <Flex vertical gap="medium">
      <Cascader aria-label="Object styles"
        options={options}
        onChange={onChange}
        placeholder="Object styles"
        classNames={classNames}
        styles={stylesObject}
        prefix="🏠"
      />
      <Cascader aria-label="Function  styles"
        options={options}
        onChange={onChange}
        placeholder="Function  styles"
        variant="filled"
        classNames={classNames}
        styles={stylesFn}
        prefix="✅"
      />
    </Flex>
  );
};

export default App;
