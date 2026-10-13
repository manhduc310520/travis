import React from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@fabi/ui/icons';
import { Flex, Space, Tag } from '@fabi/ui';
import type { GetProp, GetProps, TagProps } from '@fabi/ui';
import { createStaticStyles } from '@fabi/ui/style';

type CheckableTagGroupProps = GetProps<typeof Tag.CheckableTagGroup>;

const classNames = createStaticStyles(({ css }) => ({
  root: css`
    padding: 2px 6px;
    border-radius: 4px;
  `,
}));

const styles: TagProps['styles'] = {
  root: {
    backgroundColor: 'light-dark(#e6f7ff, #111a2c)',
  },
  icon: {
    color: 'light-dark(#237804, #8fd460)',
  },
  content: {
    color: 'light-dark(#262626, rgba(255, 255, 255, 0.85))',
  },
};

const stylesFn: TagProps['styles'] = (info): GetProp<TagProps, 'styles', 'Return'> => {
  if (info.props.variant === 'filled') {
    return {
      root: {
        backgroundColor: 'light-dark(#F5EFFF, rgba(255, 255, 255, 0.08))',
      },
      icon: {
        color: 'light-dark(#531dab, #ab7ae0)',
      },
      content: {
        color: 'light-dark(#531dab, #ab7ae0)',
      },
    };
  }
};

const groupStyles: CheckableTagGroupProps['styles'] = {
  root: {
    gap: 12,
    padding: '8px 12px',
    backgroundColor: 'light-dark(rgba(82, 196, 26, 0.08), rgba(255, 255, 255, 0.04))',
    borderRadius: 8,
  },
  item: {
    backgroundColor: 'light-dark(rgba(82, 196, 26, 0.1), rgba(255, 255, 255, 0.04))',
    borderColor: 'rgba(82, 196, 26, 0.3)',
    color: 'light-dark(#237804, #8fd460)',
  },
};

const groupStylesFn: CheckableTagGroupProps['styles'] = (
  info,
): GetProp<CheckableTagGroupProps, 'styles', 'Return'> => {
  const { multiple } = info.props;
  if (multiple) {
    return {
      root: {
        gap: 16,
        padding: '8px 12px',
        backgroundColor: 'light-dark(rgba(143, 135, 241, 0.08), rgba(255, 255, 255, 0.04))',
        borderRadius: 8,
      },
      item: {
        backgroundColor: 'light-dark(rgba(143, 135, 241, 0.1), rgba(255, 255, 255, 0.04))',
        borderColor: 'rgba(143, 135, 241, 0.3)',
        color: 'light-dark(#531dab, #ab7ae0)',
        fontWeight: 500,
      },
    };
  }
  return {};
};

const App: React.FC = () => {
  return (
    <Space size="large" vertical>
      <Flex gap="medium">
        <Tag classNames={classNames} styles={styles} icon={<CheckCircleOutlined />}>
          Object
        </Tag>
        <Tag
          variant="filled"
          classNames={classNames}
          styles={stylesFn}
          icon={<CloseCircleOutlined />}
        >
          Function
        </Tag>
      </Flex>
      <Flex vertical gap="medium">
        <Tag.CheckableTagGroup
          classNames={classNames}
          styles={groupStyles}
          options={['React', 'Vue', 'Angular']}
        />
        <Tag.CheckableTagGroup
          classNames={classNames}
          styles={groupStylesFn}
          options={['meet-student', 'thinkasany']}
          multiple
        />
      </Flex>
    </Space>
  );
};

export default App;
