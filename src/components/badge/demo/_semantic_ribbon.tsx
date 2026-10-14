import React from 'react';
import { Badge, Card } from '@fabi/ui';
import type { RibbonProps } from '@fabi/ui/es/badge/Ribbon';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element, set relative positioning and wrapper container styles',
    indicator:
      'Indicator element, set absolute positioning, padding, background color, border radius and ribbon styles',
    content: 'Content element, set text color and ribbon content display styles',
  },
};

const BlockList: React.FC<Readonly<RibbonProps>> = (props) => {
  return (
    <div style={{ width: '100%' }}>
      <Badge.Ribbon {...props} text="Hippies" color="pink">
        <Card title="Pushes open the window" size="small">
          and raises the spyglass.
        </Card>
      </Badge.Ribbon>
    </div>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Badge"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'indicator', desc: locale.indicator, version: '6.0.0' },
        { name: 'content', desc: locale.content, version: '6.0.0' },
      ]}
    >
      <BlockList />
    </SemanticPreview>
  );
};

export default App;
