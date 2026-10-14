import React from 'react';
import type { ModalProps } from '@fabi/ui';
import { Modal } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with relative positioning, top position, width, max-width, margins, bottom padding and other basic layout styles for modal container',
    mask: 'Mask element with fixed positioning, z-index, background color, animation transitions and other mask layer styles',
    wrapper:
      'Wrapper element used for motion container with animation and transition effect styles',
    container:
      'Modal container element with relative positioning, background, background-clip, border, border-radius, box-shadow, pointer-events, padding and other modal body styles',
    header: 'Header element with padding, bottom border and other header area styles',
    title:
      'Title element with margin, color, font-weight, font-size, line-height, word-wrap and other title text styles',
    body: 'Body element with content area background color, padding and other content display styles',
    footer:
      'Footer element with footer background color, padding, top border, border-radius and other footer area styles',
    close: 'Preview close button element, sets basic button styles',
  },
};

const BlockModal: React.FC<Readonly<ModalProps>> = (props) => {
  const { children, ...rest } = props;
  const divRef = React.useRef<HTMLDivElement>(null);
  return (
    <div ref={divRef} style={{ position: 'absolute', inset: 0 }}>
      <Modal
        getContainer={() => divRef.current!}
        {...rest}
        styles={{
          mask: { position: 'absolute', zIndex: 1 },
          wrapper: { position: 'absolute', zIndex: 1 },
        }}
        style={{ top: '50%', transform: 'translateY(-50%)', marginBottom: 0, paddingBottom: 0 }}
      >
        {children}
      </Modal>
    </div>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Modal"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'mask', desc: locale.mask, version: '5.13.0' },
        { name: 'container', desc: locale.container, version: '6.0.0' },
        { name: 'wrapper', desc: locale.wrapper, version: '5.13.0' },
        { name: 'header', desc: locale.header, version: '5.13.0' },
        { name: 'title', desc: locale.title, version: '6.0.0' },
        { name: 'body', desc: locale.body, version: '5.13.0' },
        { name: 'footer', desc: locale.footer, version: '5.13.0' },
        { name: 'close', desc: locale.close, version: '6.4.0' },
      ]}
    >
      <BlockModal title="Title" open getContainer={false} width={400}>
        <p>Some contents...</p>
      </BlockModal>
    </SemanticPreview>
  );
};

export default App;
