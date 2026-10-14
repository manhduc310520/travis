import React from 'react';
import { Flex, Progress, Segmented, Switch } from '@fabi/ui';
import type { ProgressProps } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element, set relative positioning and basic container styles',
    body: 'Body element, set progress bar layout and size styles',
    rail: 'Rail element, set background track color and border radius styles. Not exist in steps mode',
    track: 'Track element, set progress fill color and transition animation styles',
    indicator: 'Indicator element, set percentage text or icon position and font styles',
  },
};

const colorMap = {
  '0%': '#0958d9',
  '100%': '#237804',
};

const Block: React.FC<Readonly<ProgressProps>> = (props) => {
  const [gradient, setGradient] = React.useState(false);
  const [type, setType] = React.useState('line');

  const progressProps: any = {
    type: type === 'steps' ? 'line' : type,
    steps: type === 'steps' ? 5 : undefined,
  };

  return (
    <Flex vertical gap="medium" style={{ width: '100%' }} align="center">
      <Flex align="center" gap="medium">
        <Segmented
          options={['line', 'steps', 'circle', 'dashboard']}
          value={type}
          onChange={setType}
        />
        <Switch aria-label="Switch"
          checked={gradient}
          value={gradient}
          onChange={() => setGradient(!gradient)}
          checkedChildren="Gradient"
          unCheckedChildren="Gradient"
        />
      </Flex>
      <Flex vertical align="center" style={{ height: 200, width: '100%' }}>
        <Progress aria-label="Progress"
          percent={80}
          {...props}
          {...progressProps}
          strokeColor={gradient ? colorMap : undefined!}
        />
      </Flex>
    </Flex>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Progress"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'body', desc: locale.body },
        { name: 'rail', desc: locale.rail },
        { name: 'track', desc: locale.track },
        { name: 'indicator', desc: locale.indicator },
      ]}
    >
      <Block />
    </SemanticPreview>
  );
};

export default App;
