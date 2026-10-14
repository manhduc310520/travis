import React from 'react';
import { Button, Tour } from '@fabi/ui';
import type { TourProps } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Tour root container with absolute positioning, z-index control, max width, visibility, arrow background color variable, theme styles and other container styles',
    cover:
      'Card cover area with text center alignment, padding, image width and other image display styles',
    close:
      'Close button element with absolute positioning, size, color, hover state and other interactive feedback styles',
    section:
      'Card main content area with text alignment, border radius, box shadow, relative positioning, background color, border, background clip and other card styles',
    footer:
      'Card bottom action area with padding, text right alignment, border radius, flex layout and other bottom container styles',
    actions:
      'Action button group container with left auto margin, button spacing and other button group layout styles',
    indicator:
      'Single indicator element with width/height size, inline-block display, border radius, background color, right margin, active state and other dot styles',
    indicators:
      'Indicator group container with inline-block display and other indicator container styles',
    header:
      'Card header area with padding, width calculation, word break and other header container styles',
    title: 'Guide title text with font weight and other title text styles',
    description: 'Guide description text with padding, word wrap and other description text styles',
    mask: 'Mask layer element with fixed positioning, full screen coverage, z-index, pointer events, transition animation and other mask styles',
  },
};

const BlockList: React.FC<React.PropsWithChildren<TourProps>> = (props) => {
  const [open, setOpen] = React.useState(true);
  const createBtnRef = React.useRef<HTMLButtonElement>(null);
  return (
    <div
      style={{
        width: '100%',
        height: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Button ref={createBtnRef} onClick={() => setOpen(true)}>
        Show
      </Button>
      <Tour
        {...props}
        zIndex={1}
        open={open}
        defaultCurrent={0}
        getPopupContainer={false as unknown as TourProps['getPopupContainer']}
        onClose={() => setOpen(false)}
        steps={[
          {
            title: 'Hello World!',
            description: 'Hello World?!',
            cover: (
              <img
                alt="tour.png"
                style={{ width: 360, maxWidth: '100%' }}
                src="/mock-assets/photo-12.svg"
              />
            ),
            target: () => createBtnRef.current!,
            mask: true,
          },
          {
            title: 'Save',
            description: 'Save your changes.',
            target: () => createBtnRef.current!,
          },
        ]}
      />
    </div>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Tour"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'mask', desc: locale.mask, version: '6.0.0' },
        { name: 'section', desc: locale.section, version: '6.0.0' },
        { name: 'cover', desc: locale.cover, version: '6.0.0' },
        { name: 'close', desc: locale.close, version: '6.4.0' },
        { name: 'header', desc: locale.header, version: '6.0.0' },
        { name: 'title', desc: locale.title, version: '6.0.0' },
        { name: 'description', desc: locale.description, version: '6.0.0' },
        { name: 'footer', desc: locale.footer, version: '6.0.0' },
        { name: 'actions', desc: locale.actions, version: '6.0.0' },
        { name: 'indicators', desc: locale.indicators, version: '6.0.0' },
        { name: 'indicator', desc: locale.indicator, version: '6.0.0' },
      ]}
    >
      <BlockList />
    </SemanticPreview>
  );
};

export default App;
