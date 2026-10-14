import React from 'react';
import { Flex, Switch, Typography } from '@fabi/ui';
import type { TypographyProps } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with base typography styles, layout, and positioning',
    actions:
      'Actions element with layout and spacing styles for copy, edit, expand/collapse buttons',
    action:
      'Individual action button element including copy, edit, expand, collapse button styles like padding, border radius, colors, etc.',
    textarea:
      'TextArea element in editable mode, used to customize className and inline styles for the edit input',
  },
};

const Block: React.FC<Readonly<TypographyProps>> = (props) => {
  const [editing, setEditing] = React.useState(false);

  return (
    <Flex vertical gap="middle" align="start" style={{ width: '100%', alignSelf: 'flex-start' }}>
      <Switch aria-label="Switch"
        checked={editing}
        onChange={setEditing}
        checkedChildren="Editing"
        unCheckedChildren="Editing"
      />
      <Typography.Paragraph
        copyable
        editable={{ editing }}
        ellipsis={{ rows: 2, expandable: true }}
        style={{ width: '100%' }}
        {...props}
      >
        FABi CMS is a design language for background applications, refined by the FABi CMS team. It
        aims to uniform the user interface specs for internal background projects, lower the
        unnecessary cost of design differences and implementation and liberate the resources of
        design and front-end development.
      </Typography.Paragraph>
    </Flex>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  return (
    <SemanticPreview
      componentName="Typography"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.4.0' },
        { name: 'actions', desc: locale.actions, version: '6.4.0' },
        { name: 'action', desc: locale.action, version: '6.4.0' },
        { name: 'textarea', desc: locale.textarea, version: '6.4.0' },
      ]}
    >
      <Block />
    </SemanticPreview>
  );
};

export default App;
