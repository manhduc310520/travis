import React from 'react';
import { Radio } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element with layout styles, cursor styles, disabled text color and other basic container styles',
    icon: 'Icon element with border radius, transition animations, border styles, hover states, focus states and other interactive styles',
    label:
      'Label element with padding, text color, disabled states, alignment and other text styles',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Radio"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'icon', desc: locale.icon, version: '6.0.0' },
        { name: 'label', desc: locale.label, version: '6.0.0' },
      ]}
    >
      <Radio>Radio</Radio>
    </SemanticPreview>
  );
};

export default App;
