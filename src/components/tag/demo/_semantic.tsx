import React from 'react';
import { AppstoreOutlined } from '@fabi/ui/icons';
import { Tag } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element with inline-block display, auto height, padding, font size, line height, nowrap, background color, border, border radius, opacity, transition animations, text alignment, relative positioning and other basic tag styles',
    icon: 'Icon element with font size, color, cursor style, transition animations and other icon display styles',
    content: 'Content element with text content color, font styles and other content area styles',
    close:
      'Close element with close button layout, cursor styles, transition animations and other interaction styles',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Tag"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'icon', desc: locale.icon, version: '6.0.0' },
        { name: 'content', desc: locale.content, version: '6.0.0' },
        { name: 'close', desc: locale.close, version: '6.4.0' },
      ]}
    >
      <Tag icon={<AppstoreOutlined />} closeIcon>
        FABi CMS
      </Tag>
    </SemanticPreview>
  );
};

export default App;
