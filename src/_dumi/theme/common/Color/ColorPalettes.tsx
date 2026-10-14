import React, { useMemo } from 'react';
import { clsx } from 'clsx';

import useLocale from '../../../hooks/useLocale';
import Palette from './Palette';

const COLOR_KEYS = [
  'red',
  'volcano',
  'orange',
  'lime',
  'gold',
  'yellow',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
  'magenta',
] as const;

const locales = {
  en: {
    redTitle: 'Dust Red',
    redDescription: 'Fighting Spirit, Unrestrained',

    volcanoTitle: 'Volcano',
    volcanoDescription: 'Eye-catching, Surging',

    orangeTitle: 'Sunset Orange',
    orangeDescription: 'Warm, Cheerful',

    limeTitle: 'Lime',
    limeDescription: 'Natural, Vitality',

    goldTitle: 'Calendula Gold',
    goldDescription: 'Energetic, Positive',

    yellowTitle: 'Sunrise Yellow',
    yellowDescription: 'Birth, Sunshine',

    greenTitle: 'Polar Green',
    greenDescription: 'Healthy, Innovative',

    cyanTitle: 'Cyan',
    cyanDescription: 'Hope, Strong',

    blueTitle: 'Daybreak Blue',
    blueDescription: 'Inclusive, Technology, Universal',

    geekblueTitle: 'Geek Blue',
    geekblueDescription: 'Exploration, Research',

    purpleTitle: 'Golden Purple',
    purpleDescription: 'Elegant, Romantic',

    magentaTitle: 'French Magenta',
    magentaDescription: 'Bright, Emotional',
  },
};

const ColorPalettes: React.FC<{ dark?: boolean }> = (props) => {
  const { dark } = props;
  const [locale] = useLocale(locales);
  const memoizedColors = useMemo(() => {
    return COLOR_KEYS.map((key) => ({
      name: key,
      title: locale[`${key}Title`],
      description: locale[`${key}Description`],
    }));
  }, [locale]);
  return (
    <div className={clsx('color-palettes', { 'color-palettes-dark': dark })}>
      {memoizedColors.map((color) => (
        <Palette key={`item-${color.name}`} color={color} dark={dark} showTitle />
      ))}
    </div>
  );
};

export default ColorPalettes;
