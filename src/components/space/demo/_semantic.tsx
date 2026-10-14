import React from 'react';
import { Button, Divider, Space } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with flex layout, gap settings, alignment, wrap and other spacing container basic styles',
    item: 'Wrapped item element with spacing item layout and styles, providing wrapper for each child element for inline alignment',
    separator: 'Separator element with divider styling',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Space"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'item', desc: locale.item },
        { name: 'separator', desc: locale.separator },
      ]}
    >
      <Space separator={<Divider vertical />}>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
      </Space>
    </SemanticPreview>
  );
};

export default App;
