import React from 'react';
import { Button, Drawer, Typography } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with fixed positioning, z-index control, pointer events, color and other basic styles and layout control for drawer container',
    mask: 'Mask element with absolute positioning, z-index, background color, pointer events and other mask layer styles and interaction controls',
    section:
      'Drawer container element with flex layout, width/height, overflow control, background color, pointer events and other drawer body styles',
    header:
      'Header element with flex layout, alignment, padding, font size, line height, bottom border and other header area styles',
    body: 'Body element with flex ratio, minimum size, padding, overflow scroll and other content area display and layout styles',
    footer:
      'Footer element with flex shrink, padding, top border and other bottom operation area styles',
    title:
      'Title element with flex ratio, margin, font weight, font size, line height and other title text styles',
    extra:
      'Extra element with flex fixed layout and other additional operation content style controls',
    dragger:
      'Dragger element used to resize the drawer, with absolute positioning, transparent background, pointer events control, hover state styles, and dragging state styles',
    close: 'Close button element with basic button styling',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Drawer"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'mask', desc: locale.mask, version: '5.13.0' },
        { name: 'section', desc: locale.section, version: '6.0.0' },
        { name: 'header', desc: locale.header, version: '5.13.0' },
        { name: 'title', desc: locale.title, version: '6.0.0' },
        { name: 'extra', desc: locale.extra, version: '6.0.0' },
        { name: 'body', desc: locale.body, version: '5.13.0' },
        { name: 'footer', desc: locale.footer, version: '5.13.0' },
        { name: 'dragger', desc: locale.dragger, version: '6.0.0' },
        { name: 'close', desc: locale.close, version: '6.1.0' },
      ]}
    >
      <Drawer
        title="Title"
        placement="right"
        footer={<Typography.Link>Footer</Typography.Link>}
        open
        getContainer={false}
        extra={<Button>Cancel</Button>}
        size={300}
        resizable={{}}
      >
        <p>Some contents...</p>
      </Drawer>
    </SemanticPreview>
  );
};

export default App;
