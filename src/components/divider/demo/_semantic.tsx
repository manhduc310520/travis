import React from 'react';
import { Divider } from '@fabi/ui';
import type { DividerProps } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with border-top style, divider styling and other basic divider container styles',
    content:
      'Content element with inline-block display, padding and other divider text content styles',
    rail: 'Background rail element with border-top style and other divider connection line styles',
  },
};

const Block: React.FC<DividerProps> = (props) => {
  return (
    <div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
        ista probare, quae sunt a te dicta? Refert tamen, quo modo.
      </p>
      <Divider {...props} />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
        ista probare, quae sunt a te dicta? Refert tamen, quo modo.
      </p>
      <Divider {...props}>Solid</Divider>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
        ista probare, quae sunt a te dicta? Refert tamen, quo modo.
      </p>
      <Divider titlePlacement="left" variant="dotted" {...props}>
        Dotted
      </Divider>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi
        ista probare, quae sunt a te dicta? Refert tamen, quo modo.
      </p>
      <Divider titlePlacement="right" variant="dashed" {...props}>
        Dashed
      </Divider>
      These
      <Divider orientation="vertical" {...props} />
      are
      <Divider orientation="vertical" {...props} />
      vertical
      <Divider orientation="vertical" {...props} />
      Dividers
    </div>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Divider"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'rail', desc: locale.rail },
        { name: 'content', desc: locale.content },
      ]}
    >
      <Block />
    </SemanticPreview>
  );
};

export default App;
