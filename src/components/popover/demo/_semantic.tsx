import React from 'react';
import { Popover } from '@fabi/ui';
import type { PopoverProps } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element, set absolute positioning, z-index, transform origin, arrow direction and popover container styles',
    container:
      'Container element, set background color, padding, border radius, shadow, border and content display styles',
    arrow: 'Arrow element with width, height, position, color and border styles',
    title: 'Title element, set title text styles and spacing',
    content: 'Content element, set content text styles and layout',
  },
};

const BlockList: React.FC<React.PropsWithChildren<PopoverProps>> = (props) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const { children, ...rest } = props;
  return (
    <div ref={divRef} style={{ position: 'absolute', marginTop: 60 }}>
      <Popover
        open
        placement="top"
        title="Hello"
        content="FABi CMS love you!"
        autoAdjustOverflow={false}
        getPopupContainer={() => divRef.current!}
        {...rest}
      >
        {children}
      </Popover>
    </div>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Popover"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'container', desc: locale.container },
        { name: 'title', desc: locale.title },
        { name: 'content', desc: locale.content },
        { name: 'arrow', desc: locale.arrow },
      ]}
    >
      <BlockList />
    </SemanticPreview>
  );
};

export default App;
