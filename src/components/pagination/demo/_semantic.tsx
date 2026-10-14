import React from 'react';
import { Pagination } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element, set flex layout, alignment, flex wrap and list styles',
    item: 'Item element, set size, padding, border, background color, hover state and active state styles',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Pagination"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'item', desc: locale.item, version: '6.0.0' },
      ]}
    >
      <Pagination defaultCurrent={1} total={50} />
    </SemanticPreview>
  );
};

export default App;
