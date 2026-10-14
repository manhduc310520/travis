import React, { useMemo, useState } from 'react';
import { Col, ColorPicker, Row } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { FormattedMessage } from 'dumi';

import useLocale from '../../../hooks/useLocale';
import ColorPatterns from './ColorPatterns';

const primaryMinSaturation = 70; // recommended minimum saturation of the primary colour
const primaryMinBrightness = 70; // recommended minimum brightness of the primary colour

// antd-storybook: templates instead of functions, so useLocale can give them in the docs language
// (i18n/vi/ui.json); the same English text as ColorPaletteTool (the copy here had full-width brackets)
const locales = {
  en: {
    saturation: 'Saturation is recommended not to be lower than {min} (currently {value})',
    brightness: 'Brightness is recommended not to be lower than {min} (currently {value})',
  },
};
const fill = (template: string, min: number, value: string) =>
  template.replace('{min}', String(min)).replace('{value}', value);

const ColorPaletteTool: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState<string>('#1890ff');
  const [backgroundColor, setBackgroundColor] = useState<string>('#141414');
  const [primaryColorInstance, setPrimaryColorInstance] = useState<Color | null>(null);

  const [locale] = useLocale(locales);

  const handleChangeColor = (color: Color, hex: string) => {
    setPrimaryColor(hex);
    setPrimaryColorInstance(color);
  };

  const handleChangeBackgroundColor = (_: Color, hex: string) => {
    setBackgroundColor(hex);
  };

  const colorValidation = useMemo<React.ReactNode>(() => {
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
    return (
      <span className="color-palette-picker-validation color-palette-picker-validation-dark">
        {text.trim()}
      </span>
    );
  }, [locale, primaryColorInstance]);

  return (
    <div className="color-palette-horizontal color-palette-horizontal-dark">
      <div className="main-color">
        <ColorPatterns color={primaryColor} backgroundColor={backgroundColor} dark />
      </div>
      <div className="color-palette-picker">
        <Row>
          <Col span={12}>
            <div className="color-palette-pick">
              <FormattedMessage id="app.docs.color.pick-primary" />
            </div>
            <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
              <Row>
                <Col span={18}>
                  <ColorPicker value={primaryColor} onChange={handleChangeColor} />
                </Col>
                <Col span={6}>
                  <span className="color-palette-pick-hex">{primaryColor}</span>
                </Col>
              </Row>
            </span>
          </Col>
          <Col span={12}>
            <div className="color-palette-pick">
              <FormattedMessage id="app.docs.color.pick-background" />
            </div>
            <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
              <Row>
                <Col span={18}>
                  <ColorPicker value={backgroundColor} onChange={handleChangeBackgroundColor} />
                </Col>
                <Col span={6}>
                  <span className="color-palette-pick-hex">{backgroundColor}</span>
                </Col>
              </Row>
            </span>
          </Col>
        </Row>
        {colorValidation}
      </div>
    </div>
  );
};

export default ColorPaletteTool;
