import React from 'react';
import { DatePicker, Flex } from '@fabi/ui';
import type { DatePickerProps, GetProp } from '@fabi/ui';
import { createStyles } from '@fabi/ui/style';
import type { Dayjs } from 'dayjs';

const useStyles = createStyles(({ token }) => ({
  root: {
    border: `${token.lineWidth}px ${token.lineType} ${token.colorPrimary}`,
    width: 200,
  },
}));

const stylesObject: DatePickerProps<Dayjs>['styles'] = {
  input: { fontStyle: 'italic' },
  suffix: { opacity: 0.85 },
};

const stylesFn: DatePickerProps<Dayjs>['styles'] = (
  info,
): GetProp<DatePickerProps<Dayjs>, 'styles', 'Return'> => {
  if (info.props.size === 'large') {
    return {
      root: { borderColor: '#722ed1' },
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
      <DatePicker aria-label="Object" classNames={classNames} styles={stylesObject} placeholder="Object" />
      <DatePicker aria-label="Function" classNames={classNames} styles={stylesFn} placeholder="Function" size="large" />
    </Flex>
  );
};

export default App;
