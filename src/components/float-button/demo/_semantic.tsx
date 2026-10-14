import React from 'react';
import { QuestionCircleOutlined } from '@fabi/ui/icons';
import { FloatButton } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with float button base styles, shape size, type theme, fixed positioning, z-index, shadow, spacing and other container styles',
    content:
      'Content element with button text content font size, color, alignment, line wrap and other text display styles',
    icon: 'Icon element with button icon size, color, line height, alignment and other icon display styles',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="FloatButton"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'icon', desc: locale.icon },
        { name: 'content', desc: locale.content },
      ]}
    >
      <FloatButton._InternalPanelDoNotUseOrYouWillBeFired
        type="primary"
        shape="square"
        icon={<QuestionCircleOutlined />}
        content="HELP"
      />
    </SemanticPreview>
  );
};

export default App;
