import React, { useState } from 'react';
import { Flex, Slider, Switch, Typography } from '@fabi/ui';

const App = () => {
  const [rows, setRows] = useState(2);
  const [expanded, setExpanded] = useState(false);

  return (
    <Flex gap={16} vertical>
      <Flex gap={16} align="center">
        <Switch aria-label="Switch"
          checked={expanded}
          onChange={() => setExpanded((c) => !c)}
          style={{ flex: 'none' }}
        />
        <Slider ariaLabelForHandle="Slider" min={1} max={20} value={rows} onChange={setRows} style={{ flex: 'auto' }} />
      </Flex>

      <Typography.Paragraph
        ellipsis={{
          rows,
          expandable: 'collapsible',
          expanded,
          onExpand: (_, info) => setExpanded(info.expanded),
        }}
        copyable
      >
        {'FABi CMS, a back office for restaurants, keeps menus, orders and staff in one place.'.repeat(
          20,
        )}
      </Typography.Paragraph>
    </Flex>
  );
};

export default App;
