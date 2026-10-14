import React, { useState } from 'react';
import { Button, Drawer, Flex } from '@fabi/ui';
import type { DrawerProps, GetProp } from '@fabi/ui';
import { createStaticStyles } from '@fabi/ui/style';

const lineStyle: React.CSSProperties = {
  lineHeight: '28px',
};

const sharedContent = (
  <>
    <div style={lineStyle}>
      FABi CMS brings the daily work of a restaurant into one back office: menus, orders, tables,
      staff and stock, the same in every branch.
    </div>
    <div style={lineStyle}>🍜 Menus and prices shared by every branch.</div>
    <div style={lineStyle}>🧾 Orders from the counter, tables and delivery in one list.</div>
    <div style={lineStyle}>👥 Staff shifts, roles and permissions.</div>
    <div style={lineStyle}>📦 Stock levels with low-stock alerts.</div>
    <div style={lineStyle}>📊 Daily sales reports per branch.</div>
    <div style={lineStyle}>🎨 Your brand colours on every screen.</div>
  </>
);

const classNames = createStaticStyles(
  ({ css }): NonNullable<GetProp<DrawerProps, 'classNames', 'Return'>> => ({
    root: css`
      border-radius: 10px;
      padding: 10px;
    `,
  }),
);

const styles: DrawerProps['styles'] = {
  mask: {
    backgroundImage: `linear-gradient(to top, #18181b 0, rgba(21, 21, 22, 0.2) 100%)`,
  },
};

const stylesFn: DrawerProps['styles'] = (info): GetProp<DrawerProps, 'styles', 'Return'> => {
  if (info.props.footer) {
    return {
      header: {
        padding: 16,
      },
      body: {
        padding: 16,
      },
      footer: {
        padding: '16px 10px',
        backgroundColor: '#fafafa',
      },
    };
  }
};

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerFnOpen, setDrawerFnOpen] = useState(false);

  const sharedProps: DrawerProps = {
    classNames,
    size: 500,
  };

  const footer: React.ReactNode = (
    <Flex gap="medium" justify="flex-end">
      <Button
        onClick={() => setDrawerFnOpen(false)}
        styles={{ root: { borderColor: '#ccc', color: '#171717', backgroundColor: '#fff' } }}
      >
        Cancel
      </Button>
      <Button
        type="primary"
        styles={{ root: { backgroundColor: '#171717' } }}
        onClick={() => setDrawerOpen(true)}
      >
        Submit
      </Button>
    </Flex>
  );

  return (
    <Flex gap="medium">
      <Button onClick={() => setDrawerOpen(true)}>Open Style Drawer</Button>
      <Button type="primary" onClick={() => setDrawerFnOpen(true)}>
        Open Function Drawer
      </Button>
      <Drawer
        {...sharedProps}
        footer={null}
        title="Custom Style Drawer"
        styles={styles}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {sharedContent}
      </Drawer>
      <Drawer
        {...sharedProps}
        footer={footer}
        title="Custom Function drawer"
        styles={stylesFn}
        mask={{ enabled: true, blur: true }}
        open={drawerFnOpen}
        onClose={() => setDrawerFnOpen(false)}
      >
        {sharedContent}
      </Drawer>
    </Flex>
  );
};

export default App;
