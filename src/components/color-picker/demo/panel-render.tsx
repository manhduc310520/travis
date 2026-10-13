import React from 'react';
import { cyan, generate, green, presetPalettes, red } from '@fabi/ui/colors';
import { Col, ColorPicker, Divider, Row, Space, theme } from '@fabi/ui';
import type { ColorPickerProps } from '@fabi/ui';

type Presets = Required<ColorPickerProps>['presets'][number];

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map<Presets>(([label, colors]) => ({ label, colors, key: label }));
}

const HorizontalLayoutDemo = () => {
  const { token } = theme.useToken();

  const presets = genPresets({
    primary: generate(token.colorPrimary),
    red,
    green,
    cyan,
  });

  const customPanelRender: ColorPickerProps['panelRender'] = (
    _,
    { components: { Picker, Presets } },
  ) => (
    <Row justify="space-between" wrap={false}>
      <Col span={12}>
        <Presets />
      </Col>
      <Divider vertical style={{ height: 'auto' }} />
      <Col flex="auto">
        <Picker />
      </Col>
    </Row>
  );

  return (
    <ColorPicker
      defaultValue={token.colorPrimary}
      styles={{ popupOverlayInner: { width: 480 } }}
      presets={presets}
      panelRender={customPanelRender}
    />
  );
};

const BasicDemo = () => (
  <ColorPicker
    defaultValue="#0958d9"
    panelRender={(panel) => (
      <div className="custom-panel">
        <div
          style={{
            fontSize: 12,
            color: 'rgba(0, 0, 0, 0.88)',
            lineHeight: '20px',
            marginBottom: 8,
          }}
        >
          Color Picker
        </div>
        {panel}
      </div>
    )}
  />
);

export default () => (
  <Space vertical>
    <Space>
      <span>Add title:</span>
      <BasicDemo />
    </Space>
    <Space>
      <span>Horizontal layout:</span>
      <HorizontalLayoutDemo />
    </Space>
  </Space>
);
