import React from 'react';
import { Card, Masonry } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element, sets relative positioning, flex layout and masonry container styles',
    item: 'Item element, sets absolute positioning, width calculation, transition animation and masonry item styles',
  },
};

const heights = [75, 50, 70, 60, 85, 75, 50].map((height, index) => ({
  key: `item-${index}`,
  data: height,
}));

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Masonry"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'item', desc: locale.item },
      ]}
    >
      <Masonry
        columns={3}
        gutter={16}
        items={heights}
        style={{ width: '100%' }}
        itemRender={({ data, index }) => (
          <Card size="small" style={{ height: data }}>
            {index + 1}
          </Card>
        )}
      />
    </SemanticPreview>
  );
};

export default App;
