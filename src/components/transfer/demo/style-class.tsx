import React from 'react';
import { Flex, Transfer } from '@fabi/ui';
import type { GetProp, TransferProps } from '@fabi/ui';
import { createStyles } from '@fabi/ui/style';

const useStyles = createStyles(({ token, css }) => ({
  section: { backgroundColor: 'light-dark(rgba(250,250,250, 0.5), rgba(255, 255, 255, 0.04))' },
  header: { color: token.colorPrimary },
  actions: css`
    & button {
      background-color: light-dark(rgba(255, 242, 232, 0.6), rgba(255, 255, 255, 0.04));
    }
  `,
}));

const mockData = Array.from({ length: 20 }).map<any>((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
}));

const initialTargetKeys = mockData.filter((item) => Number(item.key) > 10).map((item) => item.key);

const stylesObject: TransferProps['styles'] = {
  header: { fontWeight: 'bold' },
};

const stylesFn: TransferProps['styles'] = (info): GetProp<TransferProps, 'styles', 'Return'> => {
  if (info.props.status === 'warning') {
    return {
      section: { backgroundColor: 'light-dark(rgba(246,255,237, 0.6), rgba(255, 255, 255, 0.04))', borderColor: '#237804' },
      header: { color: 'light-dark(#006d75, #58d1c9)', fontWeight: 'normal' },
    };
  }
  return {};
};

const App: React.FC = () => {
  const { styles: classNames } = useStyles();
  const sharedProps: TransferProps = {
    dataSource: mockData,
    targetKeys: initialTargetKeys,
    render: (item) => item.title,
    classNames,
  };
  return (
    <Flex vertical gap="large" style={{ width: '100%' }}>
      <Transfer {...sharedProps} status="error" styles={stylesObject} />
      <Transfer {...sharedProps} status="warning" styles={stylesFn} />
    </Flex>
  );
};

export default App;
