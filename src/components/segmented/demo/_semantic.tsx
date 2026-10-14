import React from 'react';
import { AppstoreOutlined, BarsOutlined } from '@fabi/ui/icons';
import { Segmented } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with inline-block layout, padding, background, border radius, transition and container styles',
    item: 'Option element with relative positioning, text alignment, cursor style, transition, selected state background and hover styles',
    icon: 'Icon element with icon size, color and text spacing styles',
    label:
      'Label content element with min height, line height, padding, text ellipsis and content layout styles',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Segmented"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'item', desc: locale.item, version: '6.0.0' },
        { name: 'label', desc: locale.label, version: '6.0.0' },
        { name: 'icon', desc: locale.icon, version: '6.0.0' },
      ]}
    >
      <Segmented<string>
        options={[
          { label: 'List', value: 'List', icon: <BarsOutlined /> },
          { label: 'Kanban', value: 'Kanban', icon: <AppstoreOutlined /> },
        ]}
      />
    </SemanticPreview>
  );
};

export default App;
