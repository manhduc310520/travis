import React from 'react';
import { Timeline } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element with timeline container list style reset, vertical layout, dot icon, outlined style, alternate layout and other basic container styles',
    item: 'Item element with single timeline node relative positioning, margin, padding, font size, finish state, color theme, layout direction and other node basic styles',
    itemWrapper: 'Item wrapper element with timeline node content wrapping container styles',
    itemIcon:
      'Item icon element with node head icon absolute positioning, width/height size, background color, border, border radius, wave animation and other icon styles',
    itemHeader:
      'Item header element with header area layout containing title and rail, alignment, text direction and other styles',
    itemTitle:
      'Item title element with node title text font size, line height, color and other text styles',
    itemSection:
      'Item section element with section container containing header and content flex layout, wrap, gap and other layout styles',
    itemContent:
      'Item content element with node detail content relative positioning, top offset, left margin, text color, word break and other content styles',
    itemRail:
      'Item rail element with timeline node connection track line absolute positioning, top offset, left offset, height, border color, width, style and other connection line styles',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Timeline"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'item', desc: locale.item },
        { name: 'itemWrapper', desc: locale.itemWrapper },
        { name: 'itemIcon', desc: locale.itemIcon },
        { name: 'itemSection', desc: locale.itemSection },
        { name: 'itemHeader', desc: locale.itemHeader },
        { name: 'itemTitle', desc: locale.itemTitle },
        { name: 'itemContent', desc: locale.itemContent },
        { name: 'itemRail', desc: locale.itemRail },
      ]}
    >
      <Timeline
        items={[
          {
            title: '2015-09-01',
            content: 'Create a services',
          },
          {
            title: '2015-09-01 09:12:11',
            content: 'Solve initial network problems',
          },
          {
            content: 'Technical testing',
          },
          {
            title: '2015-09-01 09:12:11',
            content: 'Network problems being solved',
          },
        ]}
      />
    </SemanticPreview>
  );
};

export default App;
