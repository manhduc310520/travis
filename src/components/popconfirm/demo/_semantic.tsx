import React from 'react';
import { Popconfirm } from '@fabi/ui';
import type { PopconfirmProps } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element, set absolute positioning, z-index, transform origin, arrow direction and popover container styles',
    container:
      'Container element, set background color, padding, border radius, shadow, border and content display styles',
    icon: 'Icon element, set the confirmation icon size, color and layout styles',
    arrow: 'Arrow element with width, height, position, color and border styles',
    title: 'Title element, set title text styles and spacing',
    content: 'Description element, set content text styles and layout',
  },
};

const BlockList: React.FC<React.PropsWithChildren<PopconfirmProps>> = (props) => {
  const { children, ...rest } = props;
  const divRef = React.useRef<HTMLDivElement>(null);
  return (
    <div ref={divRef} style={{ position: 'absolute', marginTop: 60 }}>
      <Popconfirm
        open
        placement="top"
        autoAdjustOverflow={false}
        getPopupContainer={() => divRef.current!}
        {...rest}
      >
        {children}
      </Popconfirm>
    </div>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Popconfirm"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'container', desc: locale.container },
        { name: 'icon', desc: locale.icon, version: '6.4.0' },
        { name: 'title', desc: locale.title },
        { name: 'content', desc: locale.content },
        { name: 'arrow', desc: locale.arrow },
      ]}
    >
      <BlockList title="Confirm" description="Are you sure you want to perform this action?" />
    </SemanticPreview>
  );
};

export default App;
