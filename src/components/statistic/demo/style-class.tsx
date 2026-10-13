import React from 'react';
import { ArrowUpOutlined } from '@fabi/ui/icons';
import { Flex, Statistic } from '@fabi/ui';
import type { GetProp, StatisticProps } from '@fabi/ui';
import { createStaticStyles } from '@fabi/ui/style';

const classNames = createStaticStyles(({ css }) => ({
  root: css`
    border: 2px dashed #ccc;
    padding: 16px;
    border-radius: 8px;
  `,
}));

const styleFn: StatisticProps['styles'] = ({
  props,
}): GetProp<StatisticProps, 'styles', 'Return'> => {
  const numValue = Number(props.value ?? 0);
  const isNegative = Number.isFinite(numValue) && numValue < 0;
  if (isNegative) {
    return {
      title: {
        color: 'light-dark(#cf1322, #f37370)',
      },
      content: {
        color: 'light-dark(#a8071a, #f37370)',
      },
      value: {
        backgroundColor: 'light-dark(#fff1f0, rgba(255, 255, 255, 0.04))',
        borderRadius: 4,
        paddingInline: 6,
        userSelect: 'none',
      },
    };
  }
  return {};
};

const Demo: React.FC = () => {
  const statisticSharedProps: StatisticProps = {
    classNames: { root: classNames.root },
    prefix: <ArrowUpOutlined />,
  };
  return (
    <Flex vertical gap="medium">
      <Statistic
        {...statisticSharedProps}
        title="Monthly Active Users"
        value={93241}
        styles={{
          title: { color: 'light-dark(#0958d9, #65a9f3)', fontWeight: 600 },
          content: { fontSize: '24px' },
          value: {
            backgroundColor: 'light-dark(#e6f4ff, #111a2c)',
            borderRadius: 4,
            color: 'light-dark(#0958d9, #65a9f3)',
            paddingInline: 6,
            userSelect: 'none',
          },
        }}
        suffix="users"
      />
      <Statistic
        {...statisticSharedProps}
        title="Yearly Loss"
        value={-18.7}
        precision={1}
        styles={styleFn}
        suffix="%"
      />
    </Flex>
  );
};

export default Demo;
