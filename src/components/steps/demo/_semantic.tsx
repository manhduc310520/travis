import React from 'react';
import { Flex, Steps } from '@fabi/ui';
import type { StepsProps } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import type { SemanticPreviewInjectionProps } from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with flex layout, nowrap, alignment, CSS variables and other basic step container styles',
    item: 'Step item element with flex layout, relative positioning and other basic step item container styles',
    itemWrapper:
      'Step item wrapper element with flex layout, nowrap, top padding and other step content wrapping styles',
    itemIcon:
      'Step item icon element with icon size, positioning, font-size and other icon display related styles',
    itemHeader:
      'Step item header element with flex layout, nowrap, alignment and other header area layout styles',
    itemTitle:
      'Step item title element with color, font-size, line-height, word-break, transitions and other title text styles',
    itemSubtitle:
      'Step item subtitle element with color, font-weight, font-size, line-height, margin, word-break and other subtitle styles',
    itemSection: 'Step item section element with step content area layout and styling',
    itemContent:
      'Step item content element with color, font-size, line-height, word-break, transitions and other content text styles',
    itemRail:
      'Step item rail element with border-style, border-width, transitions and other connecting line styles',
  },
};

const sharedProps: StepsProps = {
  current: 1,
  style: { width: '100%' },
  titlePlacement: 'vertical',
  items: Array.from({ length: 3 }, (_, index) => ({
    title: `Step ${index + 1}`,
    subTitle: `00:0${index}`,
    content: 'This is a content.',
  })),
};

const Block = (props: SemanticPreviewInjectionProps) => (
  <Flex vertical gap="large" style={{ width: '100%' }}>
    <Steps {...sharedProps} {...props} />
    <Steps {...sharedProps} {...props} type="panel" size="small" titlePlacement="horizontal" />
  </Flex>
);

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Steps"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'item', desc: locale.item },
        { name: 'itemWrapper', desc: locale.itemWrapper },
        { name: 'itemIcon', desc: locale.itemIcon },
        { name: 'itemHeader', desc: locale.itemHeader },
        { name: 'itemTitle', desc: locale.itemTitle },
        { name: 'itemSubtitle', desc: locale.itemSubtitle },
        { name: 'itemSection', desc: locale.itemSection },
        { name: 'itemContent', desc: locale.itemContent },
        { name: 'itemRail', desc: locale.itemRail },
      ]}
    >
      <Block />
    </SemanticPreview>
  );
};

export default App;
