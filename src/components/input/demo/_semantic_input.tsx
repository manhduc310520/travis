import React from 'react';
import { EditOutlined, UserOutlined } from '@fabi/ui/icons';
import { Input } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element with relative positioning, inline-block display, width, min-width, padding, colors, fonts, line-height, border-radius, transitions and other input container basic styles',
    input: 'Input element with core interactive styles and text input related styling',
    prefix: 'Prefix wrapper element with layout and styling for prefix content',
    suffix: 'Suffix wrapper element with layout and styling for suffix content',
    clear:
      'Clear button element with layout, visibility, and interaction styles for clearing content',
    count: 'Character count element with font and color styles for count display',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Input"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'prefix', desc: locale.prefix },
        { name: 'input', desc: locale.input },
        { name: 'suffix', desc: locale.suffix },
        { name: 'clear', desc: locale.clear, version: '6.4.0' },
        { name: 'count', desc: locale.count },
      ]}
    >
      <Input aria-label="Input"
        allowClear
        showCount
        prefix={<UserOutlined />}
        suffix={<EditOutlined />}
        defaultValue="Hello, FABi CMS"
      />
    </SemanticPreview>
  );
};

export default App;
