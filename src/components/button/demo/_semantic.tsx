import React from 'react';
import { AppstoreOutlined } from '@fabi/ui/icons';
import { Button } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element with comprehensive button styling including border, background, padding, border-radius, box-shadow, transitions, cursor, font-weight, alignment, and layout properties',
    content:
      'Content element that wraps button text with typography styles including nowrap, text-align center, and Chinese character spacing optimization',
    icon: 'Icon element with font-size, color inheritance, and SVG style reset for proper icon display',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Button"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'icon', desc: locale.icon, version: '5.5.0' },
        { name: 'content', desc: locale.content, version: '6.0.0' },
      ]}
    >
      <Button type="primary" icon={<AppstoreOutlined />}>
        FABi CMS
      </Button>
    </SemanticPreview>
  );
};

export default App;
