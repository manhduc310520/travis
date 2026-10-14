import React, { useState } from 'react';
import { Switch, Typography } from '@fabi/ui';

const { Paragraph, Text } = Typography;

const App: React.FC = () => {
  const [ellipsis, setEllipsis] = useState(true);

  return (
    <>
      <Switch aria-label="Switch"
        checked={ellipsis}
        onChange={() => {
          setEllipsis(!ellipsis);
        }}
      />

      <Paragraph ellipsis={ellipsis}>
        FABi CMS, a back office for restaurants, keeps menus, orders and staff in one place. FABi
        CMS, a back office for restaurants, keeps menus, orders and staff in one place. FABi
        CMS, a back office for restaurants, keeps menus, orders and staff in one place. FABi
        CMS, a back office for restaurants, keeps menus, orders and staff in one place. FABi
        CMS, a back office for restaurants, keeps menus, orders and staff in one place. FABi
        CMS, a back office for restaurants, keeps menus, orders and staff in one place.
      </Paragraph>

      <Paragraph ellipsis={ellipsis ? { rows: 2, expandable: true, symbol: 'more' } : false}>
        FABi CMS, a back office for restaurants, keeps menus, orders and staff in one place. FABi
        CMS, a back office for restaurants, keeps menus, orders and staff in one place. FABi
        CMS, a back office for restaurants, keeps menus, orders and staff in one place. FABi
        CMS, a back office for restaurants, keeps menus, orders and staff in one place. FABi
        CMS, a back office for restaurants, keeps menus, orders and staff in one place. FABi
        CMS, a back office for restaurants, keeps menus, orders and staff in one place.
      </Paragraph>

      <Text
        style={ellipsis ? { width: 200 } : undefined}
        ellipsis={ellipsis ? { tooltip: 'I am ellipsis now!' } : false}
      >
        FABi CMS, a back office for restaurants, keeps menus, orders and staff in one place.
      </Text>

      <Text
        code
        style={ellipsis ? { width: 200 } : undefined}
        ellipsis={ellipsis ? { tooltip: 'I am ellipsis now!' } : false}
      >
        FABi CMS, a back office for restaurants, keeps menus, orders and staff in one place.
      </Text>
    </>
  );
};

export default App;
