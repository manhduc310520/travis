import React from 'react';
import { Button, Tooltip } from '@fabi/ui';

const style: React.CSSProperties = {
  width: '300vw',
  height: '300vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const App: React.FC = () => {
  React.useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);
  return (
    <div style={style}>
      <Tooltip title="Thanks for using FABi CMS. Have a nice day!" open getPopupContainer={(trigger) => trigger.parentElement ?? document.body}>
        <Button type="primary">Scroll The Window</Button>
      </Tooltip>
    </div>
  );
};

export default App;
