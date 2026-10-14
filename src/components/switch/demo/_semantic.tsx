import React from 'react';
import { Switch } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with min-width, height, line-height, vertical alignment, background color, border, border radius, cursor style, transition animations, user selection and other basic switch container styles',
    content:
      'Content element with block display, overflow hidden, border radius, height, padding, transition animations and other switch content area layout and styles',
    indicator:
      'Indicator element with absolute positioning, width, height, background color, border radius, shadow, transition animations and other switch handle styles and interactive effects',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Switch"
      motion
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'content', desc: locale.content, version: '6.0.0' },
        { name: 'indicator', desc: locale.indicator, version: '6.3.0' },
      ]}
    >
      <Switch aria-label="Switch" checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
    </SemanticPreview>
  );
};

export default App;
