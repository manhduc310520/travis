import React from 'react';
import { Tooltip } from '@fabi/ui';
import type { TooltipProps } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element (including arrows, content elements) with absolute positioning, z-index, block display, max width, visibility, transform origin and arrow background color',
    container:
      'Content element with min width and height, padding, color, text alignment, background color, border radius, shadow and border styles',
    arrow: 'Arrow element with width, height, position, color and border styles',
  },
};

const BlockList: React.FC<React.PropsWithChildren<TooltipProps>> = (props) => {
  const { children, ...rest } = props;
  const divRef = React.useRef<HTMLDivElement>(null);
  return (
    <div ref={divRef} style={{ position: 'absolute', marginTop: 60 }}>
      <Tooltip
        open
        placement="top"
        title="tooltip prompt text"
        autoAdjustOverflow={false}
        getPopupContainer={() => divRef.current!}
        {...rest}
      >
        {children}
      </Tooltip>
    </div>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Tooltip"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'container', desc: locale.container },
        { name: 'arrow', desc: locale.arrow },
      ]}
    >
      <BlockList />
    </SemanticPreview>
  );
};

export default App;
