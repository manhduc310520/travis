import React from 'react';
import { Divider } from '@fabi/ui';
import type { DividerProps, GetProp } from '@fabi/ui';

const classNamesObject: DividerProps['classNames'] = {
  root: 'demo-divider-root',
  content: 'demo-divider-content',
  rail: 'demo-divider-rail',
};

const classNamesFn: DividerProps['classNames'] = (
  info,
): GetProp<DividerProps, 'classNames', 'Return'> => {
  if (info.props.titlePlacement === 'start') {
    return {
      root: 'demo-divider-root--start',
    };
  }
  return {
    root: 'demo-divider-root--default',
  };
};

const stylesObject: DividerProps['styles'] = {
  root: { borderWidth: 2, borderStyle: 'dashed' },
  content: { fontStyle: 'italic' },
  rail: { opacity: 0.85 },
};

const stylesFn: DividerProps['styles'] = (info): GetProp<DividerProps, 'styles', 'Return'> => {
  if (info.props.size === 'small') {
    return {
      root: { opacity: 0.85, cursor: 'default' },
    };
  }
  return {
    root: { backgroundColor: '#fafafa', borderColor: '#d9d9d9' },
  };
};

const App: React.FC = () => (
  <div>
    <Divider classNames={classNamesObject}>classNames Object</Divider>
    <Divider titlePlacement="start" classNames={classNamesFn}>
      classNames Function
    </Divider>
    <Divider styles={stylesObject}>styles Object</Divider>
    <Divider size="small" styles={stylesFn}>
      styles Function
    </Divider>
  </div>
);

export default App;
