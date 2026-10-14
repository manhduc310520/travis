import React from 'react';
import { Avatar, Badge } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element with relative positioning, inline-block display, and fit-content width for basic layout',
    indicator:
      'Indicator element with positioning, z-index, dimensions, colors, fonts, text alignment, background, border-radius, box-shadow, and transition animations for complete badge styling',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Badge"
      semantics={[
        { name: 'root', desc: locale.root, version: '5.7.0' },
        { name: 'indicator', desc: locale.indicator, version: '5.7.0' },
      ]}
    >
      <Badge count={5}>
        <Avatar shape="square" size="large" />
      </Badge>
    </SemanticPreview>
  );
};

export default App;
