import React from 'react';
import { Calendar } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element containing background, border, border-radius and overall layout structure of the calendar component',
    header:
      'Header element with layout and style control for year selector, month selector and mode switcher',
    body: 'Body element with padding and layout control for the calendar table that contains the calendar grid',
    content: 'Content element with width, height and table styling control for the calendar table',
    item: 'Item element with background, border, hover state, selected state and other interactive styles for calendar cells',
    itemContent:
      'Item content element with height, overflow and other style control for custom content area inside calendar cells',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Calendar"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'header', desc: locale.header, version: '6.0.0' },
        { name: 'body', desc: locale.body, version: '6.0.0' },
        { name: 'content', desc: locale.content, version: '6.0.0' },
        { name: 'item', desc: locale.item, version: '6.0.0' },
        { name: 'itemContent', desc: locale.itemContent, version: '6.4.0' },
      ]}
    >
      <Calendar />
    </SemanticPreview>
  );
};

export default App;
