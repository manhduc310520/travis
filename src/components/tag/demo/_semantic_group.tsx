import React from 'react';
import { Tag } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element with tag group container styles and layout',
    item: 'Tag item element with inline-block display, height, padding, font size, line height, background color, border, border radius, opacity, transition animation, checkable state and other styles',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Tag"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'item', desc: locale.item },
      ]}
    >
      <Tag.CheckableTagGroup
        defaultValue="Books"
        options={['Movies', 'Books', 'Music', 'Sports']}
      />
    </SemanticPreview>
  );
};

export default App;
