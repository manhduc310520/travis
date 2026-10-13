import React from 'react';
import { ConfigProvider, message } from '@fabi/ui';

/** Test usage. Do not use in your production. */
const { _InternalPanelDoNotUseOrYouWillBeFired: InternalPanel } = message;

export default () => (
  <>
    <ConfigProvider
      theme={{
        components: {
          Message: {
            contentPadding: 40,
            contentBg: '#0958d9',
          },
        },
      }}
    >
      <InternalPanel content="Hello World!" type="error" />
    </ConfigProvider>
    <ConfigProvider
      theme={{
        components: {
          Message: {
            colorBgElevated: '#0958d9',
          },
        },
      }}
    >
      <InternalPanel content="Hello World!" type="error" />
    </ConfigProvider>
  </>
);
