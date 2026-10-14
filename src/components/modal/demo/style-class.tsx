import React, { useState } from 'react';
import { Button, Flex, Modal } from '@fabi/ui';
import type { GetProp, ModalProps } from '@fabi/ui';
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

const classNames = createStaticStyles(({ css }) => ({
  container: css`
    border-radius: 10px;
    padding: 10px;
  `,
}));

const styles: ModalProps['styles'] = {
  mask: {
    backgroundImage: `linear-gradient(to top, #18181b 0, rgba(21, 21, 22, 0.2) 100%)`,
  },
};

const stylesFn: ModalProps['styles'] = (info): GetProp<ModalProps, 'styles', 'Return'> => {
  if (info.props.footer) {
    return {
      container: {
        borderRadius: 14,
        border: '1px solid #ccc',
        padding: 0,
        overflow: 'hidden',
      },
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
  return {};
};

const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFnOpen, setModalFnOpen] = useState(false);

  const sharedProps: ModalProps = {
    centered: true,
    classNames,
  };

  const footer: React.ReactNode = (
    <>
      <Button
        onClick={() => setModalFnOpen(false)}
        styles={{ root: { borderColor: '#ccc', color: '#171717', backgroundColor: '#fff' } }}
      >
        Cancel
      </Button>
      <Button
        type="primary"
        styles={{ root: { backgroundColor: '#171717' } }}
        onClick={() => setModalOpen(true)}
      >
        Submit
      </Button>
    </>
  );

  return (
    <Flex gap="medium">
      <Button onClick={() => setModalOpen(true)}>Open Style Modal</Button>
      <Button type="primary" onClick={() => setModalFnOpen(true)}>
        Open Function Modal
      </Button>
      <Modal
        {...sharedProps}
        footer={null}
        title="Custom Style Modal"
        styles={styles}
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        {sharedContent}
      </Modal>
      <Modal
        {...sharedProps}
        footer={footer}
        title="Custom Function Modal"
        styles={stylesFn}
        mask={{ enabled: true, blur: true }}
        open={modalFnOpen}
        onOk={() => setModalFnOpen(false)}
        onCancel={() => setModalFnOpen(false)}
      >
        {sharedContent}
      </Modal>
    </Flex>
  );
};

export default App;
