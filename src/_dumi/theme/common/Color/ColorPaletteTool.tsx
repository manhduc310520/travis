import React from 'react';
import { ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { FormattedMessage } from 'dumi';

import useLocale from '../../../hooks/useLocale';
import ColorPatterns from './ColorPatterns';

const primaryMinSaturation = 70; // 主色推荐最小饱和度
const primaryMinBrightness = 70; // 主色推荐最小亮度

// antd-storybook: templates instead of functions, so useLocale can give them in the docs language
// (i18n/vi/ui.json); {min} / {value} are filled in below
const locales = {
  cn: {
    saturation: '饱和度建议不低于{min}（当前值 {value}）',
    brightness: '亮度建议不低于{min}（当前值 {value}）',
  },
  en: {
    saturation: 'Saturation is recommended not to be lower than {min} (currently {value})',
    brightness: 'Brightness is recommended not to be lower than {min} (currently {value})',
  },
};
const fill = (template: string, min: number, value: string) =>
  template.replace('{min}', String(min)).replace('{value}', value);

const ColorPaletteTool: React.FC = () => {
  const [primaryColor, setPrimaryColor] = React.useState<string>('#1890ff');
  const [primaryColorInstance, setPrimaryColorInstance] = React.useState<Color>();

  const [locale] = useLocale(locales);

  const handleChangeColor = (color: Color, hex: string) => {
    setPrimaryColor(hex);
    setPrimaryColorInstance(color);
  };

  const colorValidation = React.useMemo<React.ReactNode>(() => {
    let text = '';
    if (primaryColorInstance) {
      const { s, b } = primaryColorInstance.toHsb() || {};
      if (s * 100 < primaryMinSaturation) {
        text += ` ${fill(locale.saturation, primaryMinSaturation, (s * 100).toFixed(2))}`;
      }
      if (b * 100 < primaryMinBrightness) {
        text += ` ${fill(locale.brightness, primaryMinBrightness, (b * 100).toFixed(2))}`;
      }
    }
    return <span className="color-palette-picker-validation">{text.trim()}</span>;
  }, [primaryColorInstance, locale]);
  return (
    <div className="color-palette-horizontal">
      <div className="color-palette-pick">
        <FormattedMessage id="app.docs.color.pick-primary" />
      </div>
      <div className="main-color">
        <ColorPatterns color={primaryColor} />
      </div>
      <div className="color-palette-picker">
        <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <ColorPicker value={primaryColor} onChange={handleChangeColor} />
        </span>
        <span className="color-palette-picker-value">{primaryColor}</span>
        {colorValidation}
      </div>
    </div>
  );
};

export default ColorPaletteTool;
