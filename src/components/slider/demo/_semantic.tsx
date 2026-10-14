import React from 'react';
import { Slider } from '@fabi/ui';

import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';
import useLocale from '../../../_dumi/hooks/useLocale';

const locales = {
  en: {
    root: 'Root element with relative positioning, height, margin, padding, cursor style and touch action control',
    track:
      'Track selection bar element with absolute positioning, background color, border radius and transition animation styles',
    tracks:
      'Multi-segment track container element with absolute positioning and transition animation styles',
    rail: 'Background rail element with absolute positioning, background color, border radius and transition animation styles',
    handle:
      'Slider handle control element with absolute positioning, size, outline, user selection, background color, border shadow, border radius, cursor style and transition animation',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Slider"
      semantics={[
        { name: 'root', desc: locale.root, version: '5.23.0' },
        { name: 'track', desc: locale.track, version: '5.10.0' },
        { name: 'tracks', desc: locale.tracks, version: '5.10.0' },
        { name: 'rail', desc: locale.rail, version: '5.10.0' },
        { name: 'handle', desc: locale.handle, version: '5.10.0' },
      ]}
    >
      <Slider ariaLabelForHandle="Slider" range defaultValue={[20, 30, 50]} style={{ width: '100%' }} />
    </SemanticPreview>
  );
};

export default App;
