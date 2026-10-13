import React from 'react';
import { MehOutlined } from '@fabi/ui/icons';
import { Flex, Select } from '@fabi/ui';
import type { GetProp, SelectProps } from '@fabi/ui';
import { createStaticStyles } from '@fabi/ui/style';

const classNames = createStaticStyles(({ css }) => ({
  root: css`
    border-radius: 8px;
    width: 300px;
  `,
}));

const options: SelectProps['options'] = [
  { value: 'GuangZhou', label: 'GuangZhou' },
  { value: 'ShenZhen', label: 'ShenZhen' },
];

const stylesObject: SelectProps['styles'] = {
  prefix: {
    color: '#0958d9',
  },
  suffix: {
    color: '#0958d9',
  },
};

const stylesFn: SelectProps['styles'] = ({ props }): GetProp<SelectProps, 'styles', 'Return'> => {
  if (props.variant === 'filled') {
    return {
      prefix: {
        color: '#722ed1',
      },
      suffix: {
        color: '#722ed1',
      },
      popup: {
        root: {
          border: '1px solid #722ed1',
        },
      },
    };
  }
  return {};
};

const App: React.FC = () => {
  const sharedProps: SelectProps = {
    options,
    classNames,
    prefix: <MehOutlined />,
  };
  return (
    <Flex vertical gap="medium">
      <Select aria-label="Object" {...sharedProps} styles={stylesObject} placeholder="Object" />
      <Select aria-label="Function" {...sharedProps} styles={stylesFn} placeholder="Function" variant="filled" />
    </Flex>
  );
};

export default App;
