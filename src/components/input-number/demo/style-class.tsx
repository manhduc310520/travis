import React from 'react';
import { Flex, InputNumber } from '@fabi/ui';
import type { GetProp, InputNumberProps } from '@fabi/ui';
import { createStyles } from '@fabi/ui/style';

const useStyle = createStyles(({ token }) => ({
  root: {
    border: `${token.lineWidth}px ${token.lineType} ${token.colorPrimary}`,
    borderRadius: token.borderRadiusLG,
    width: 200,
  },
}));

const stylesObject: InputNumberProps['styles'] = {
  input: {
    fontSize: 14,
  },
};

const stylesFn: InputNumberProps['styles'] = ({
  props,
}): GetProp<InputNumberProps, 'styles', 'Return'> => {
  if (props.size === 'large') {
    return {
      root: {
        backgroundColor: 'light-dark(rgba(250,250,250, 0.5), rgba(255, 255, 255, 0.04))',
        borderColor: '#722ed1',
      },
    };
  }
  return {};
};

const App: React.FC = () => {
  const { styles: classNames } = useStyle();
  const sharedProps: InputNumberProps = {
    classNames,
  };
  return (
    <Flex vertical gap="medium">
      <InputNumber aria-label="Object" {...sharedProps} styles={stylesObject} placeholder="Object" />
      <InputNumber aria-label="Function" {...sharedProps} styles={stylesFn} placeholder="Function" size="large" />
    </Flex>
  );
};

export default App;
