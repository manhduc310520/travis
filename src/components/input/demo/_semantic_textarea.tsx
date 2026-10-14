import React from 'react';
import { Input } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element with textarea wrapper styles, border, border radius, transition animation and state control',
    textarea:
      'Textarea element with font, line height, padding, color, background, border, text input and multi-line text display styles',
    clear:
      'Clear button element with layout, visibility, and interaction styles for clearing content',
    count:
      'Count element with character count display position, font, color and numeric statistics styles',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Input.TextArea"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'textarea', desc: locale.textarea },
        { name: 'clear', desc: locale.clear, version: '6.4.0' },
        { name: 'count', desc: locale.count },
      ]}
    >
      <Input.TextArea aria-label="Text"
        allowClear
        defaultValue="Hello, FABi CMS"
        rows={3}
        count={{ max: 100, show: true }}
      />
    </SemanticPreview>
  );
};

export default App;
