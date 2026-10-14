import React from 'react';
import type { ColorPickerProps } from '@fabi/ui';
import { ColorPicker, Flex } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Trigger container with border styles, transition animations, size controls, displaying color block and text content',
    body: 'Color block container with background color, border styles',
    content: 'Color block element with actual selected color styles',
    description: 'Description text content with font styles and color',
    'popup.root':
      'Popup panel root container with background color, shadow effects, color selection panel, slider controls and preset colors',
  },
};

const Block: React.FC<Readonly<ColorPickerProps>> = (props) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  return (
    <Flex ref={divRef} style={{ height: 300 }} align="flex-start" gap="small">
      <ColorPicker
        defaultValue="#0958d9"
        open
        showText
        {...props}
        getPopupContainer={() => divRef.current || document.body}
        styles={{
          popup: {
            root: { zIndex: 1 },
          },
        }}
      />
      <ColorPicker open={false} allowClear {...props} />
    </Flex>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="ColorPicker"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'body', desc: locale.body },
        { name: 'content', desc: locale.content },
        { name: 'description', desc: locale.description },
        { name: 'popup.root', desc: locale['popup.root'] },
      ]}
    >
      <Block />
    </SemanticPreview>
  );
};

export default App;
