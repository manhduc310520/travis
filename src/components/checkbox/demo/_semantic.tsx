import React from 'react';
import { Checkbox } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element with inline-flex layout, baseline alignment, cursor style, reset styles and other basic checkbox container styles',
    icon: 'Checkbox icon element with size, direction, background, border, border-radius, transitions, and checked state checkmark styles',
    label: 'Label text element with padding and spacing styles relative to the checkbox',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Checkbox"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'icon', desc: locale.icon, version: '6.0.0' },
        { name: 'label', desc: locale.label, version: '6.0.0' },
      ]}
    >
      <Checkbox>Checkbox</Checkbox>
    </SemanticPreview>
  );
};

export default App;
