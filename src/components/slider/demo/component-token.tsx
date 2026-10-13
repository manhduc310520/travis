import React from 'react';
import { ConfigProvider, Slider } from '@fabi/ui';

const style: React.CSSProperties = {
  display: 'inline-block',
  height: 300,
  marginInlineStart: 70,
};

const marks = {
  0: '0°C',
  26: '26°C',
  37: '37°C',
  100: {
    style: { color: '#ad2102' },
    label: <strong>100°C</strong>,
  },
};

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      components: {
        Slider: {
          controlSize: 20,
          railSize: 4,
          handleSize: 22,
          handleSizeHover: 18,
          dotSize: 8,
          handleLineWidth: 6,
          handleLineWidthHover: 2,
          railBg: '#9f3434',
          railHoverBg: '#8d2424',
          trackBg: '#b0b0ef',
          trackHoverBg: '#c77195',
          handleColor: '#e6f6a2',
          handleActiveColor: '#d22bc4',
          dotBorderColor: '#303030',
          dotActiveBorderColor: '#918542',
          trackBgDisabled: '#1a1b80',
        },
      },
    }}
  >
    <Slider ariaLabelForHandle="Slider" defaultValue={30} disabled />
    <Slider ariaLabelForHandle="Slider" range={{ draggableTrack: true }} defaultValue={[20, 50]} />
    <div style={style}>
      <Slider ariaLabelForHandle="Slider" vertical defaultValue={30} />
    </div>
    <div style={style}>
      <Slider ariaLabelForHandle="Slider" vertical range step={10} defaultValue={[20, 50]} />
    </div>
    <div style={style}>
      <Slider ariaLabelForHandle="Slider" vertical range marks={marks} defaultValue={[26, 37]} />
    </div>
  </ConfigProvider>
);

export default App;
