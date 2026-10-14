import React from 'react';
import { UserOutlined } from '@fabi/ui/icons';
import { AutoComplete, Flex, Input } from '@fabi/ui';
import { createStyles } from '@fabi/ui/style';

const useStyles = createStyles((props) => {
  const { css, prefixCls, cssVar } = props;
  return {
    categorySearch: css`
      .${prefixCls}-select-dropdown-menu-item-group-title {
        color: #666;
        font-weight: ${cssVar.fontWeightStrong};
      }
      .${prefixCls}-select-dropdown-menu-item-group {
        border-bottom: ${cssVar.lineWidth} ${cssVar.lineType} #f6f6f6;
      }
      .${prefixCls}-select-dropdown-menu-item {
        padding-inline-start: ${cssVar.padding};
      }
      .${prefixCls}-select-dropdown-menu-item.show-all {
        text-align: center;
        cursor: default;
      }
      .${prefixCls}-select-dropdown-menu {
        max-height: 300px;
      }
    `,
  };
});

const Title: React.FC<Readonly<{ title?: string }>> = (props) => (
  <Flex align="center" justify="space-between">
    {props.title}
    <a href="https://example.com" target="_blank" rel="noopener noreferrer">
      more
    </a>
  </Flex>
);

const renderItem = (title: string, count: number) => ({
  value: title,
  label: (
    <Flex align="center" justify="space-between">
      {title}
      <span>
        <UserOutlined /> {count}
      </span>
    </Flex>
  ),
});

const options = [
  {
    label: <Title title="Dishes" />,
    options: [renderItem('Beef pho', 10000), renderItem('Chicken pho', 10600)],
  },
  {
    label: <Title title="Branches" />,
    options: [renderItem('District 1 branch', 60100), renderItem('District 3 branch', 30010)],
  },
  {
    label: <Title title="Reports" />,
    options: [renderItem('Daily sales report', 100000)],
  },
];

const App: React.FC = () => {
  const { styles } = useStyles();
  return (
    <AutoComplete aria-label="Search"
      classNames={{ popup: { root: styles.categorySearch } }}
      popupMatchSelectWidth={500}
      style={{ width: 250 }}
      options={options}
    >
      <Input.Search aria-label="input here" size="large" placeholder="input here" />
    </AutoComplete>
  );
};

export default App;
