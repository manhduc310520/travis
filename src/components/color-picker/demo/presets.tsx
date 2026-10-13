import React from 'react';
import { generate, green, presetPalettes, red } from '@fabi/ui/colors';
import { ColorPicker, theme } from '@fabi/ui';
import type { ColorPickerProps } from '@fabi/ui';

type Presets = Required<ColorPickerProps>['presets'][number];

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map<Presets>(([label, colors]) => ({ label, colors, key: label }));
}

const Demo: React.FC = () => {
  const { token } = theme.useToken();
  const presets = genPresets({ primary: generate(token.colorPrimary), red, green });
  return <ColorPicker presets={presets} defaultValue="#0958d9" />;
};

export default Demo;
