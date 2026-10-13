import React from 'react';
import { Tour } from '@fabi/ui';

/** Test usage. Do not use in your production. */
const { _InternalPanelDoNotUseOrYouWillBeFired: InternalPanel } = Tour;

export default () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      rowGap: 16,
      background: 'rgba(50,0,0,0.65)',
      padding: 8,
    }}
  >
    <InternalPanel title="Hello World!" description="Hello World?!" />
    <InternalPanel
      title="Hello World!"
      description="Hello World?!"
      cover={
        <img
          draggable={false}
          alt="tour.png"
          src="/mock-assets/photo-12.svg"
        />
      }
      current={5}
      total={7}
    />
    <InternalPanel
      title="Hello World!"
      description="Hello World?!"
      type="primary"
      current={4}
      total={5}
    />
  </div>
);
