import React from 'react';
import { Button, Result } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element with text alignment, layout styles and other basic container styles',
    title:
      'Title element with font size, text color, line height, text alignment and other text styles',
    subTitle: 'Subtitle element with font size, text color, line height and other text styles',
    body: 'Content element with margin, padding, background color and other content area styles',
    extra:
      'Action area element with margin, text alignment, inner element spacing and other layout styles',
    icon: 'Icon element with margin, text alignment, font size, status colors and other icon styles',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Result"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'icon', desc: locale.icon, version: '6.0.0' },
        { name: 'title', desc: locale.title, version: '6.0.0' },
        { name: 'subTitle', desc: locale.subTitle, version: '6.0.0' },
        { name: 'extra', desc: locale.extra, version: '6.0.0' },
        { name: 'body', desc: locale.body, version: '6.0.0' },
      ]}
    >
      <Result
        title="title"
        subTitle="subTitle"
        extra={
          <Button type="primary" key="console">
            extra
          </Button>
        }
      >
        <div style={{ textAlign: 'center' }}>The Content of Result</div>
      </Result>
    </SemanticPreview>
  );
};

export default App;
