import React from 'react';
import { Button, Result } from '@fabi/ui';
import type { GetProp, ResultProps } from '@fabi/ui';

const classNamesObject: ResultProps['classNames'] = {
  root: 'demo-result-root',
  title: 'demo-result-title',
  subTitle: 'demo-result-subtitle',
  icon: 'demo-result-icon',
  extra: 'demo-result-extra',
  body: 'demo-result-body',
};

const classNamesFn: ResultProps['classNames'] = (
  info,
): GetProp<ResultProps, 'classNames', 'Return'> => {
  if (info.props.status === 'success') {
    return {
      root: 'demo-result-root--success',
    };
  }
  return {
    root: 'demo-result-root--default',
  };
};

const stylesObject: ResultProps['styles'] = {
  root: { borderWidth: 2, borderStyle: 'dashed', padding: 16 },
  title: { fontStyle: 'italic', color: 'light-dark(#0958d9, #65a9f3)' },
  subTitle: { fontWeight: 'bold' },
  icon: { opacity: 0.8 },
  extra: { backgroundColor: 'light-dark(#f0f0f0, rgba(255, 255, 255, 0.08))', padding: 8 },
  body: { backgroundColor: 'light-dark(#fafafa, rgba(255, 255, 255, 0.04))', padding: 12 },
};

const stylesFn: ResultProps['styles'] = (info): GetProp<ResultProps, 'styles', 'Return'> => {
  if (info.props.status === 'error') {
    return {
      root: { backgroundColor: 'light-dark(#fff2f0, rgba(255, 255, 255, 0.04))', borderColor: '#cf1322' },
      title: { color: 'light-dark(#cf1322, #f37370)' },
    };
  } else {
    return {
      root: { backgroundColor: 'light-dark(#f6ffed, rgba(255, 255, 255, 0.04))', borderColor: '#237804' },
      title: { color: 'light-dark(#237804, #8fd460)' },
    };
  }
};

const App: React.FC = () => {
  return (
    <>
      <Result
        status="info"
        title="classNames Object"
        subTitle="This is a subtitle"
        styles={stylesObject}
        classNames={classNamesObject}
        extra={<Button type="primary">Action</Button>}
      >
        <div>Content area</div>
      </Result>
      <Result
        status="success"
        title="classNames Function"
        subTitle="Dynamic class names"
        styles={stylesFn}
        classNames={classNamesFn}
        extra={<Button>Action</Button>}
      />
    </>
  );
};

export default App;
