import React from 'react';
import { message } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    list: 'Message list root element, set positioning, z-index, width, scroll area and placement styles',
    listContent:
      'Message list content element, set notice layout, gap and height transition styles',
    root: 'Message item root element, set background color, border radius, shadow, padding and animation styles',
    wrapper: 'Wrapper element for icon and title, set content layout, gap and alignment styles',
    icon: 'Icon element, set font size, line height and status color styles',
    title: 'Title element, set text color, font size, line height and content display styles',
  },
};

const PureList = message._InternalListDoNotUseOrYouWillBeFired;

const previewListStyle: React.CSSProperties = {
  position: 'relative',
  inset: 'auto',
  width: '100%',
  maxWidth: '100%',
  height: 'auto',
  padding: 24,
  overflow: 'visible',
  transform: 'none',
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Message"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'wrapper', desc: locale.wrapper, version: '6.4.0' },
        { name: 'icon', desc: locale.icon, version: '6.0.0' },
        { name: 'title', desc: locale.title, version: '6.4.0' },
        { name: 'list', desc: locale.list, version: '6.4.0' },
        { name: 'listContent', desc: locale.listContent, version: '6.4.0' },
      ]}
    >
      <PureList
        style={previewListStyle}
        items={[
          {
            key: 'semantic-message-1',
            content: 'Hello, FABi CMS!',
            type: 'success',
            duration: false,
          },
          {
            key: 'semantic-message-2',
            content: 'Welcome back!',
            type: 'info',
            duration: false,
          },
        ]}
      />
    </SemanticPreview>
  );
};

export default App;
