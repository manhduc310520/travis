import React from 'react';
import { Divider, Flex, Timeline } from '@fabi/ui';
import type { TimelineProps } from '@fabi/ui';

const longText = 'Long Text '.repeat(5);

const sharedProps: TimelineProps = {
  orientation: 'horizontal',
  styles: {
    item: {
      boxShadow: '0 0 1px rgba(255,0,0,0.6)',
    },
  },
  items: [
    {
      title: longText,
      content: longText,
    },
    {
      content: longText,
    },
    {
      content: longText,
    },
    {
      title: longText,
      content: longText,
    },
  ],
};

const App: React.FC = () => (
  <Flex vertical>
    <Timeline {...sharedProps} mode="start" />
    <Divider />
    <Timeline {...sharedProps} mode="end" />
    <Divider />
    <Timeline {...sharedProps} mode="alternate" />
  </Flex>
);

export default App;
