import React from 'react';
import { Timeline } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import type { SemanticPreviewInjectionProps } from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element',
    wrapper: 'Item wrapper element',
    icon: 'Item icon element',
    header: 'Item header element',
    title: 'Item title element',
    section: 'Item section element',
    content: 'Item content element',
    rail: 'Item rail element',
  },
};

const Block = ({ classNames }: SemanticPreviewInjectionProps) => {
  return (
    <Timeline
      items={[
        {
          title: '2015-09-01 09:12:11',
          content: 'Solve initial network problems',
          classNames,
        },
        {
          title: '2015-09-01 11:11:11',
          content: 'Technical testing',
        },
      ]}
    />
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Timeline"
      itemsAPI={`items`}
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'wrapper', desc: locale.wrapper },
        { name: 'icon', desc: locale.icon },
        { name: 'section', desc: locale.section },
        { name: 'header', desc: locale.header },
        { name: 'title', desc: locale.title },
        { name: 'content', desc: locale.content },
        { name: 'rail', desc: locale.rail },
      ]}
    >
      <Block />
    </SemanticPreview>
  );
};

export default App;
