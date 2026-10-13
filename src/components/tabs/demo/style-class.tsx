import React from 'react';
import { Flex, Tabs } from '@fabi/ui';
import type { GetProp, TabsProps } from '@fabi/ui';
import { createStaticStyles } from '@fabi/ui/style';

const classNames = createStaticStyles(({ css }) => ({
  root: css`
    border-width: 2px;
    border-style: dashed;
    padding: 16px;
    margin-bottom: 10px;
  `,
}));

const stylesObject: TabsProps['styles'] = {
  root: { borderWidth: 2, borderStyle: 'dashed', padding: 16, marginBottom: 10 },
  header: { backgroundColor: 'light-dark(rgba(245,245,245,0.5), rgba(255, 255, 255, 0.04))' },
  item: { fontWeight: 'bold', color: 'light-dark(#0958d9, #65a9f3)', padding: `6px 10px` },
  indicator: { backgroundColor: 'light-dark(rgba(255,77,79, 0.3), #58181c)', height: 4 },
  body: { backgroundColor: 'light-dark(rgba(230,247,255,0.8), rgba(255, 255, 255, 0.04))' },
  content: { padding: 16 },
};

const stylesFn: TabsProps['styles'] = (info): GetProp<TabsProps, 'styles', 'Return'> => {
  if (info.props.type === 'card') {
    return {
      root: { backgroundColor: 'light-dark(rgba(250,250,250, 0.8), rgba(255, 255, 255, 0.04))', borderColor: '#d9d9d9' },
      header: { textAlign: 'start' },
    };
  }
  return {};
};

const items = [
  {
    key: '1',
    label: 'Tab 1',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Tab 2',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Tab 3',
    children: 'Content of Tab Pane 3',
  },
];

const App: React.FC = () => {
  const shareProps: TabsProps = {
    items,
    defaultActiveKey: '1',
    classNames,
  };

  return (
    <Flex vertical gap="medium">
      <Tabs {...shareProps} styles={stylesObject} />
      <Tabs tabPlacement="start" type="card" {...shareProps} styles={stylesFn} />
    </Flex>
  );
};

export default App;
