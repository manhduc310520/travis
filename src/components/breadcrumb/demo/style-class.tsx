import React from 'react';
import { Breadcrumb, Flex } from '@fabi/ui';
import type { BreadcrumbProps, GetProp } from '@fabi/ui';
import { createStaticStyles } from '@fabi/ui/style';

const classNames = createStaticStyles(({ css }) => ({
  root: css`
    padding: 8px;
    border-radius: 4px;
  `,
  item: css`
    color: light-dark(#1890ff, #65a9f3);
  `,
  separator: css`
    color: light-dark(rgba(0, 0, 0, 0.45), rgba(255, 255, 255, 0.65));
  `,
}));

const styles: BreadcrumbProps['styles'] = {
  root: { border: '1px solid #f0f0f0', padding: 8, borderRadius: 4 },
  item: { color: 'light-dark(#0958d9, #65a9f3)' },
  separator: { color: 'light-dark(rgba(0, 0, 0, 0.45), rgba(255, 255, 255, 0.65))' },
};

const stylesFn: BreadcrumbProps['styles'] = (
  info,
): GetProp<BreadcrumbProps, 'styles', 'Return'> => {
  const items = info.props.items || [];
  if (items.length > 2) {
    return {
      root: { border: '1px solid #F5EFFF', padding: 8, borderRadius: 4 },
      item: { color: 'light-dark(#531dab, #ab7ae0)' },
    };
  }
  return {};
};

const items = [
  { title: 'FABi CMS' },
  { title: <a href="">Component</a> },
  { title: 'Breadcrumb' },
];

const App: React.FC = () => {
  return (
    <Flex vertical gap="medium">
      <Breadcrumb
        classNames={classNames}
        items={items.slice(0, 2)}
        styles={styles}
        aria-label="Breadcrumb with Object"
      />
      <Breadcrumb
        classNames={classNames}
        items={items}
        styles={stylesFn}
        aria-label="Breadcrumb with Function"
      />
    </Flex>
  );
};

export default App;
