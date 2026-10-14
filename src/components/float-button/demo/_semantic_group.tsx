import React from 'react';
import { AlertOutlined, BugOutlined, BulbOutlined } from '@fabi/ui/icons';
import { FloatButton } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with float button group container styles, fixed positioning, z-index, padding, gap, direction mode and other combined layout styles',
    list: 'List element with button group list flex layout, border radius, shadow, animation transition, vertical alignment and other list container styles',
    item: 'Item element with individual float button styles, size, shape, type, state, icon content and other button base styles',
    itemIcon:
      'Item icon element with float button icon size, color, alignment and other icon display styles',
    itemContent:
      'Item content element with float button text content, badge, description and other content area styles',
    trigger:
      'Trigger element with menu mode trigger button styles, shape, icon, hover state, expand/collapse state and other interaction styles',
    triggerIcon:
      'Trigger icon element with trigger button icon styles, rotation animation, toggle state and other icon interaction styles',
    triggerContent:
      'Trigger content element with trigger button content area text, identifier, state indicator and other content styles',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="FloatButton"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'list', desc: locale.list },
        { name: 'item', desc: locale.item },
        { name: 'itemIcon', desc: locale.itemIcon },
        { name: 'itemContent', desc: locale.itemContent },
        { name: 'trigger', desc: locale.trigger },
        { name: 'triggerIcon', desc: locale.triggerIcon },
        { name: 'triggerContent', desc: locale.triggerContent },
      ]}
      style={{
        paddingTop: 100,
      }}
    >
      <FloatButton._InternalPanelDoNotUseOrYouWillBeFired
        type="primary"
        shape="square"
        items={[
          {
            icon: <AlertOutlined />,
            content: 'warn',
          },
          {
            icon: <BugOutlined />,
            content: 'bug',
          },
          {
            icon: <BulbOutlined />,
            content: 'idea',
          },
        ]}
        trigger="hover"
        open
        content="back"
      />
    </SemanticPreview>
  );
};

export default App;
