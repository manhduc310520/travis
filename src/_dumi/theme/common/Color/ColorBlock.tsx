import React, { useMemo } from 'react';
import { App, theme } from 'antd';

import { useUiText } from '../../../hooks/useLocale';
import { isDarkSurface, textOn } from './fabiDark';
import copy from 'antd/es/_util/copy';

interface ColorBlockProps {
  color: string;
  index: number;
  dark?: boolean;
}

const ColorBlock: React.FC<ColorBlockProps> = (props) => {
  const { message } = App.useApp();
  const t = useUiText();
  const { color, index, dark } = props;
  const fabiDark = isDarkSurface(theme.useToken().token.colorBgContainer);
  const textStyle = useMemo<React.CSSProperties>(() => {
    const colorMap = { default: ['#fff', 'unset'], dark: ['#314659', '#fff'] };
    const [lastColor, firstColor] = dark ? colorMap.dark : colorMap.default;
    return {
      background: color,
      color: (fabiDark && textOn(color)) || (index > 5 ? lastColor : firstColor),
      fontWeight: index === 6 ? 'bold' : 'normal',
    };
  }, [color, dark, index, fabiDark]);

  const onCopy = async () => {
    await copy(color);
    message.success(t('Copied: {value}', { value: color }));
  };

  return (
    <div className="main-color-item" style={{ ...textStyle, cursor: 'pointer' }} onClick={onCopy}>
      color-{index}
      <span className="main-color-value">{color.toLowerCase()}</span>
    </div>
  );
};

export default ColorBlock;
