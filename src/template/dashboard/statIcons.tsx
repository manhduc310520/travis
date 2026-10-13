// Illustrated icons of the dashboard's small figure cards (StatisticCard `icon`): the design's own artwork.
// Each layer sits in its box as drawn, in % of the card's icon tile (top right bottom left), so it scales
// with the tile; an image that carries its drop shadow overflows its box by `bleed` and the tile clips it.
import React from 'react';
import type { CSSProperties } from 'react';
import discount from './assets/stat-discount.svg';
import customersBack from './assets/stat-customers-back.svg';
import customersFront from './assets/stat-customers-front.svg';
import eInvoice from './assets/stat-einvoice.svg';

function Layer({ box, bleed = '0', src }: { box: string; bleed?: string; src: string }) {
  return (
    <span style={{ position: 'absolute', inset: box }}>
      <span style={{ position: 'absolute', inset: bleed }}>
        <img alt="" src={src} style={{ display: 'block', width: '100%', height: '100%', maxWidth: 'none' }} />
      </span>
    </span>
  );
}

/** "Giảm giá và chi phí": price tag */
export const DiscountIcon = () => <Layer box="20.05% 20% 18.61% 20%" bleed="-115.84% -157.89% -193.07% -157.89%" src={discount} />;

/** "Số khách": two people, the front one frosted */
export const CustomersIcon = () => (
  <>
    <Layer box="34.09% 18.18% 29.54% 52.27%" src={customersBack} />
    <Layer box="25% 36.48% 23.71% 18.18%" src={customersFront} />
  </>
);

/** "Số hoá đơn điện tử": e-invoice */
export const EInvoiceIcon = () => <Layer box="18.18% 20.45% 18.18% 22.73%" bleed="-111.65% -166.74% -186.08% -166.74%" src={eInvoice} />;

// "Tổng hoá đơn" is drawn from plain shapes, not an image: a gold sheet behind a frosted orange one
// with three text lines. Colours as designed: Yellow 4 → Gold 7 for the back sheet.
const sheet = (s: CSSProperties): CSSProperties => ({ position: 'absolute', ...s });
const line = (inset: string, angle: number): CSSProperties =>
  sheet({ inset, borderRadius: 99, backgroundImage: `linear-gradient(${angle}deg, rgba(255, 255, 255, 0.17) 0.886%, #fff 98.639%)` });

/** "Tổng hoá đơn": a stack of invoices */
export const InvoicesIcon = () => (
  <>
    <span style={sheet({ inset: '18.83% 22.73% 28.89% 38.64%', borderRadius: 2, backgroundImage: 'linear-gradient(143.716deg, #fff566 17.512%, #d48806 69.156%)' })} />
    <span
      style={sheet({
        inset: '30.2% 38.64% 17.53% 22.73%',
        borderRadius: 1,
        border: '1px solid rgba(255, 255, 255, 0.17)',
        backdropFilter: 'blur(1.5px)',
        backgroundImage: 'linear-gradient(18.366deg, rgba(245, 166, 92, 0.7) 11.801%, rgba(245, 166, 92, 0.5) 49.653%, rgba(255, 255, 255, 0.5) 88.991%)',
      })}
    />
    <span style={line('37.01% 45.45% 59.58% 27.27%', -5.974)} />
    <span style={line('46.11% 52.27% 50.49% 27.27%', -7.943)} />
    <span style={line('55.2% 59.09% 41.39% 27.27%', -11.821)} />
  </>
);
