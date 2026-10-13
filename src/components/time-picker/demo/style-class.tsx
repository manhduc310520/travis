import React from 'react';
import { Flex, TimePicker } from '@fabi/ui';
import type { GetProp, TimePickerProps } from '@fabi/ui';
import { createStyles } from '@fabi/ui/style';

const useStyles = createStyles(({ token }) => ({
  root: {
    border: `${token.lineWidth}px ${token.lineType} ${token.colorPrimary}`,
    width: 150,
  },
}));

const stylesObject: TimePickerProps['styles'] = {
  root: {
    borderColor: '#d9d9d9',
  },
};

const stylesFn: TimePickerProps['styles'] = (
  info,
): GetProp<TimePickerProps, 'styles', 'Return'> => {
  if (info.props.size === 'large') {
    return {
      root: {
        borderColor: '#722ed1',
      },
      suffix: {
        color: '#722ed1',
      },
      popup: {
        container: { border: '1px solid #722ed1', borderRadius: 8 },
      },
    };
  }
  return {};
};

const App: React.FC = () => {
  const { styles: classNames } = useStyles();
  return (
    <Flex vertical gap="medium">
      <TimePicker aria-label="Object" classNames={classNames} styles={stylesObject} placeholder="Object" />
      <TimePicker aria-label="Function" classNames={classNames} styles={stylesFn} placeholder="Function" size="large" />
    </Flex>
  );
};

export default App;
