import React from 'react';
import { Skeleton } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with table display, width, animation effects, border radius and other skeleton container basic styles',
    header:
      'Header element with table cell, padding, vertical alignment and other avatar placeholder area layout styles',
    section: 'Section element with skeleton content area layout styles',
    avatar:
      'Avatar element with inline-block display, vertical alignment, background color, size, border radius and other avatar placeholder styles',
    title:
      'Title element with width, height, background color, border radius and other title placeholder styles',
    paragraph:
      'Paragraph element with padding, list item styles, background color, border radius and other paragraph placeholder styles',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Skeleton"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'header', desc: locale.header, version: '6.0.0' },
        { name: 'section', desc: locale.section, version: '6.0.0' },
        { name: 'avatar', desc: locale.avatar, version: '6.0.0' },
        { name: 'title', desc: locale.title, version: '6.0.0' },
        { name: 'paragraph', desc: locale.paragraph, version: '6.0.0' },
      ]}
    >
      <Skeleton avatar paragraph={{ rows: 4 }} />
    </SemanticPreview>
  );
};

export default App;
