import React from 'react';
import { Descriptions, Flex } from '@fabi/ui';
import type { DescriptionsProps, GetProp } from '@fabi/ui';
import { createStaticStyles } from '@fabi/ui/style';

const classNames = createStaticStyles(({ css }) => ({
  root: css`
    padding: 10px;
  `,
}));

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Product',
    children: 'Cloud Database',
  },
  {
    key: '2',
    label: 'Billing Mode',
    children: 'Prepaid',
  },
  {
    key: '3',
    label: 'Automatic Renewal',
    children: 'YES',
  },
];

const styles: DescriptionsProps['styles'] = {
  label: {
    color: 'light-dark(#000, rgba(255, 255, 255, 0.85))',
  },
};

const stylesFn: DescriptionsProps['styles'] = (
  info,
): GetProp<DescriptionsProps, 'styles', 'Return'> => {
  if (info.props.size === 'large') {
    return {
      root: {
        borderRadius: 8,
        border: '1px solid #CDC1FF',
      },
      label: { color: 'light-dark(#531dab, #ab7ae0)' },
    };
  }
  return {};
};

const App: React.FC = () => {
  const descriptionsProps: DescriptionsProps = {
    title: 'User Info',
    items,
    bordered: true,
    classNames,
  };

  return (
    <Flex vertical gap="medium">
      <Descriptions {...descriptionsProps} styles={styles} size="small" />
      <Descriptions {...descriptionsProps} styles={stylesFn} size="large" />
    </Flex>
  );
};

export default App;
