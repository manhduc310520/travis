import React from 'react';
import { Anchor } from '@fabi/ui';
import type { AnchorProps } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element with layout positioning, padding, margin, background color and other basic styles',
    item: 'Link item element with padding, text color, hover states, transition animations and other styles',
    itemTitle:
      'Title text element with font styles, color changes, text decoration, transition effects and other styles',
    indicator:
      'Indicator element with width, height, background color, position changes, transition animations and other styles',
  },
};

const Block: React.FC<Readonly<AnchorProps>> = (props) => {
  return (
    <Anchor
      {...props}
      affix={false}
      items={[
        {
          key: 'api',
          href: '#api',
          title: 'API',
          children: [
            {
              key: '4',
              href: '#anchor-props',
              title: 'Anchor Props',
            },
            {
              key: '5',
              href: '#link-props',
              title: 'Link Props',
            },
          ],
        },
        {
          key: '1',
          href: '#anchor-demo-basic',
          title: 'Basic demo',
        },
        {
          key: '2',
          href: '#anchor-demo-static',
          title: 'Static demo',
        },
      ]}
    />
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Anchor"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'item', desc: locale.item, version: '6.0.0' },
        { name: 'itemTitle', desc: locale.itemTitle, version: '6.0.0' },
        { name: 'indicator', desc: locale.indicator, version: '6.0.0' },
      ]}
    >
      <Block />
    </SemanticPreview>
  );
};

export default App;
